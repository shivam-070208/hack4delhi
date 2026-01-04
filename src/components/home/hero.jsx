import Link from "next/link";
import Container from "../common/container";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import { FiExternalLink } from "react-icons/fi";

const HeroLanding = () => {
  return (
    <Container size="full" as={"section"} className="blur-in">
      <Heading
        size="2xl"
        align="center"
        className="mt-30 text-shadow-md md:text-5xl lg:text-6xl"
      >
        Welcome to Nexus
        <br /> HR Portal
      </Heading>
      <SubHeading align="center" className="mt-2 text-xs md:text-sm">
        The integrated platform for Government of Delhi departments.
        <br />
        Seamlessly manage employee records, HR tasks, and departmental
        workflows—all in one secure place.
      </SubHeading>
      <Container size="full" className="flew-wrap flex w-fit gap-2">
        <Button asChild>
          <Link
            href={"/login"}
            className="flex items-center gap-2 bg-linear-to-br from-blue-500 to-blue-600 text-white"
          >
            Login
            <span>
              <FiExternalLink className="ml-1 inline-block" />
            </span>
          </Link>
        </Button>
      </Container>
    </Container>
  );
};

export { HeroLanding };
