"use client";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuLogo,
  NavigationMenuItem,
} from "../ui/navigation-menu";
import Container from "./container";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import GlassSurface from "../ui/glass-surface";
import { useState } from "react";

const NabLinks = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "login",
    href: "/login",
  },
];

const NavBar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (progress) => {
    if (progress > 70) setIsScrolled(true);
    else setIsScrolled(false);
  });

  return (
    <Container
      size="full"
      padding="none"
      className={cn(
        "sticky top-0 z-99 h-fit transition-all",
        isScrolled && "top-5",
      )}
    >
      <motion.div
        initial={{
          y: -100,
        }}
        animate={{
          borderRadius: isScrolled ? ["0px", "100px", "999px"] : "0px",
          width: isScrolled ? "90%" : "100%",
          borderWidth: isScrolled ? ["0.4px", "1px"] : "0px",
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: "backInOut",
        }}
        className={cn(
          "relative mx-auto w-full overflow-hidden bg-transparent p-2",
          isScrolled && "[backdrop-filter:url('#displacementFilter')]",
        )}
      >
        <GlassSurface />
        <NavigationMenu
          viewport={false}
          className=" items-center  justify-between"
        >
          <NavigationMenuLogo>
            <NavigationMenuLink asChild>
              <Link href={"/"}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <div className="h-4 w-4 rotate-45 rounded-sm bg-white" />
                </div>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuLogo>
          <NavigationMenuList className="hidden sm:flex">
            {NabLinks.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link href={link.href}>{link.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </Container>
  );
};

export default NavBar;
