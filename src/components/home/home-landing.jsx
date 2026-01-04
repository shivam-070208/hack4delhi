import Container from "../common/container";
import NavBar from "../common/navbar";
import { Features } from "./features";
import { HeroLanding } from "./hero";

const LandingPage = () => {
  return (
    <Container size="large" className="blur-in" padding="small">
      <NavBar />
      <HeroLanding />
      <Features />
    </Container>
  );
};

export default LandingPage;
