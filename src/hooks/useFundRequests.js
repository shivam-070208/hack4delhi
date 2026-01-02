import { useEffect, useState } from "react";

export function useFundRequests() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/funds/my-requests");
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { data, isLoading, isError, refetch: fetchRequests };
}
