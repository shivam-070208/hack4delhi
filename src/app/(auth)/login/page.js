import Login from "@/components/common/login";
import {unauthRequire} from "@/lib/auth-utils"
const Page =async () => {
  await unauthRequire()
  return <Login />;
};

export default Page;
