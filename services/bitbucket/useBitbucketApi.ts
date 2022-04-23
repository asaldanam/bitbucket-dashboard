import useSWR from "swr";
import bitbucketApi from "./bitbucket.api";

export default function useBitbucketApi(params: Parameters<typeof useSWR>[0]) {
  return useSWR(params, bitbucketApi);
}