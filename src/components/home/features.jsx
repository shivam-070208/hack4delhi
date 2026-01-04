import Container from "../common/container"
import { Heading } from "../ui/heading"
import { SubHeading } from "../ui/sub-heading"
import { FiUsers, FiShield, FiLayers, FiList, FiEdit } from "react-icons/fi"

const features = [
  {
    icon: <FiUsers className="text-blue-600 text-3xl mb-3" />,
    title: "Role-Based Access Control (RBAC)",
    description: "Restrict and manage access based on roles such as Admin, HR manager, and Employees. Ensure each user only sees features they're permitted to use.",
  },
  {
    icon: <FiShield className="text-green-600 text-3xl mb-3" />,
    title: "Secure Data Management",
    description:
      "All sensitive employee and organizational data kept secure. Fine-grained access permissions reduce the risk of data leaks.",
  },
  {
    icon: <FiLayers className="text-purple-600 text-3xl mb-3" />,
    title: "Multi-Department Support",
    description:
      "Handle HR operations seamlessly across multiple government departments, with departmental segmentation and custom RBAC permissions.",
  },
  {
    icon: <FiList className="text-orange-600 text-3xl mb-3" />,
    title: "Task & Workflow Automation",
    description:
      "Automate repetitive HR workflows while controlling who can review, approve, or edit each process based on their assigned role.",
  },
  {
    icon: <FiEdit className="text-pink-600 text-3xl mb-3" />,
    title: "Custom Permission Policies",
    description:
      "Create, edit, and view rule sets for each department or user type, ensuring flexible and frictionless access control.",
  },
]

const Features = () => {
  return (
    <Container as="section" id="features" size="full" className="py-20 mt-10" id="features">
      <Heading size="xl" align="center">
        Platform Features
      </Heading>
      <SubHeading align="center" className="max-w-2xl mx-auto mt-2 mb-12">
        Explore the tools and controls that power your HR portal experience — built with enterprise-grade RBAC and security at the core.
      </SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-white shadow-md border border-muted p-8 flex flex-col items-start transition hover:shadow-lg hover:border-primary"
          >
            {feature.icon}
            <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}

export { Features }
