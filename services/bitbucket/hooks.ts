import { useEffect } from "react";
import { auth } from "./auth";

export function useBitbucketAuth() {

  useEffect(() => {
    auth()
  }, [])  
}