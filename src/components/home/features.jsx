import Container from "../common/container";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import { FiUsers, FiShield, FiLayers, FiList, FiEdit } from "react-icons/fi";

const features = [
  {
    icon: <FiUsers className="mb-3 text-3xl text-blue-600" />,
    title: "Role-Based Access Control (RBAC)",
    description:
      "Restrict and manage access based on roles such as Admin, HR manager, and Employees. Ensure each user only sees features they're permitted to use.",
  },
  {
    icon: <FiShield className="mb-3 text-3xl text-green-600" />,
    title: "Secure Data Management",
    description:
      "All sensitive employee and organizational data kept secure. Fine-grained access permissions reduce the risk of data leaks.",
  },
  {
    icon: <FiLayers className="mb-3 text-3xl text-purple-600" />,
    title: "Multi-Department Support",
    description:
      "Handle HR operations seamlessly across multiple government departments, with departmental segmentation and custom RBAC permissions.",
  },
  {
    icon: <FiList className="mb-3 text-3xl text-orange-600" />,
    title: "Task & Workflow Automation",
    description:
      "Automate repetitive HR workflows while controlling who can review, approve, or edit each process based on their assigned role.",
  },
  {
    icon: <FiEdit className="mb-3 text-3xl text-pink-600" />,
    title: "Custom Permission Policies",
    description:
      "Create, edit, and view rule sets for each department or user type, ensuring flexible and frictionless access control.",
  },
];

const Features = () => {
  return (
    <Container
      as="section"
      id="features"
      size="full"
      className="mt-10 py-20"
      id="features"
    >
      <Heading size="xl" align="center">
        Platform Features
      </Heading>
      <SubHeading align="center" className="mx-auto mt-2 mb-12 max-w-2xl">
        Explore the tools and controls that power your HR portal experience —
        built with enterprise-grade RBAC and security at the core.
      </SubHeading>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="border-muted hover:border-primary flex flex-col items-start rounded-xl border bg-white p-8 shadow-md transition hover:shadow-lg"
          >
            {feature.icon}
            <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export { Features };
