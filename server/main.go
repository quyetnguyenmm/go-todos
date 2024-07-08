package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Todo struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Comleted bool               `json:"completed" bson:"completed"`
	Name     string             `json:"name" bson:"name"`
}

var collection *mongo.Collection
var ctx = context.Background()

func main() {

	error := godotenv.Load()
	if error != nil {
		log.Fatal("Failed to load the .env file")
	}

	PORT := ":" + os.Getenv("PORT")
	MONGO_URI := os.Getenv("MONGO_URI")

	clientOptions := options.Client().ApplyURI(MONGO_URI)
	client, error := mongo.Connect(ctx, clientOptions)

	if error != nil {
		log.Fatal(error)
	}

	defer client.Disconnect(ctx)

	// Ping

	error = client.Ping(ctx, readpref.Primary())

	if error != nil {
		log.Fatal(error)
	}

	fmt.Println("🚀 MongoDb database is connected")

	collection = client.Database("todos-db").Collection("todos")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	app.Get("/api/todos", getTodoList)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	app.Listen(PORT)
}

func getTodoList(c *fiber.Ctx) error {
	var todos []Todo = []Todo{}

	cursor, error := collection.Find(ctx, bson.D{})

	if error != nil {
		log.Fatal(error)
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var todo Todo

		error := cursor.Decode(&todo)

		if error != nil {
			log.Fatal(error)
		}

		todos = append(todos, todo)
	}

	return c.Status(fiber.StatusOK).JSON(todos)
}

func createTodo(c *fiber.Ctx) error {
	todo := &Todo{}

	error := c.BodyParser(todo)
	if error != nil {
		log.Fatal(error)
	}

	if strings.TrimSpace(todo.Name) == "" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"message": "Todo is required."})
	}

	result, error := collection.InsertOne(ctx, todo)

	if error != nil {
		log.Fatal(error)
	}

	todo.ID = result.InsertedID.(primitive.ObjectID)

	return c.Status(fiber.StatusCreated).JSON(todo)
}

func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	objectId, error := primitive.ObjectIDFromHex(id)

	if error != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"message": "Todo is not valid."})
	}

	filter := bson.D{{Key: "_id", Value: objectId}}
	var result Todo
	collection.FindOne(ctx, filter).Decode(&result)

	var update primitive.D
	if result.Comleted {
		update = bson.D{{Key: "$set", Value: bson.D{{Key: "completed", Value: false}}}}
	} else {
		update = bson.D{{Key: "$set", Value: bson.D{{Key: "completed", Value: true}}}}
	}

	_, error = collection.UpdateOne(ctx, filter, update)

	if error != nil {
		log.Fatal(error)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Todo is updated."})
}

func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	objectId, error := primitive.ObjectIDFromHex(id)

	if error != nil {
		log.Fatal(error)
	}

	filter := bson.D{{Key: "_id", Value: objectId}}

	_, error = collection.DeleteOne(ctx, filter)

	if error != nil {
		log.Fatal(error)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Todo is deleted."})
}
