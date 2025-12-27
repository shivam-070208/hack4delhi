import { authRequire } from "@/lib/auth-utils";

const page = async  () =>{
    await authRequire("admin");
    return (
        <p>Admin</p>
    )
}

export default page;