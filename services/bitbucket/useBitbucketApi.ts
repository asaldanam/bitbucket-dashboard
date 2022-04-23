import { Params } from "next/dist/server/router";
import useSWR from "swr";
import bitbucketApi from "./bitbucket.api";

export default function useBitbucketApi(params: Params) {
  return useSWR(params, bitbucketApi);
}