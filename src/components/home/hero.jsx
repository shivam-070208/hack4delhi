import Link from "next/link"
import Container from "../common/container"
import { Button } from "../ui/button"
import { Heading } from "../ui/heading"
import {SubHeading} from "../ui/sub-heading"
import { FiExternalLink } from "react-icons/fi"

const HeroLanding = () => {
    
    return (
        <Container size="full" as={"section"} className="blur-in">
            <Heading size="2xl" align="center" className="md:text-5xl text-shadow-md lg:text-6xl mt-30">
                Welcome to Nexus<br/> HR Portal
            </Heading>
            <SubHeading align="center" className="mt-2 text-xs md:text-sm">
                The integrated platform for Government of Delhi departments.<br />
                Seamlessly manage employee records, HR tasks, and departmental workflows—all in one secure place.
            </SubHeading>
            <Container size="full" className="flex gap-2 flew-wrap w-fit">
            <Button asChild>
                <Link href={"/login"} className="text-white bg-linear-to-br from-blue-500 to-blue-600 flex items-center gap-2">
                    Login
                    <span>
                      
                        <FiExternalLink className="inline-block ml-1" />
                    </span>
                </Link>
            </Button>
          
            </Container>
        
        </Container>
    )
}

export {
    HeroLanding 
}