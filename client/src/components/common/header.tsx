import { Container } from "../common";

export function Header() {
  return (
    <header>
      <Container>
        <div className="header-content py-8">
          <div className="header-brand font-semibold text-2xl">
            QUYET NGUYEN
          </div>
        </div>
      </Container>
    </header>
  );
}
