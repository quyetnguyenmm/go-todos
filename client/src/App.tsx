import { TodoBoard, TodoForm } from './components';
import { Container, Footer, Header } from './components/common';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Container>
          <div className="py-12">
            <TodoForm />
            <TodoBoard />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
