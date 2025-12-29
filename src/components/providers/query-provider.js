"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const client = new QueryClient()
const QueryProvider = ({
    children
}) =>{
    return(
        <QueryClientProvider client={client}  >
            {children}
        </QueryClientProvider>
    )
}


export {
    QueryProvider
}