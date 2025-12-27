import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { forbidden, redirect } from "next/navigation";

export const getSession=async ()=> {
    try{
  return await getServerSession(authOptions);
    }catch(err){
        return null;
    }
}


export const authRequire = async (role = "user") => {
    const { user } = await getSession() || {};
    if (!user) {
        redirect("/login");
    }
    if (user.role !== role) {
            forbidden();
    }
    

}

export const unauthRequire = async () =>{
    const {user} =await getSession();
    if (user) {
      if (user.role === "admin") {
        redirect("/admin/dashboard");
      } else {
        redirect("/login");
      }
    }
}

