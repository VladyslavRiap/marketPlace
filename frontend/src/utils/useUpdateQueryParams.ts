import { useRouter } from "next/router";

export const useUpdateQueryParams = () => {
  const router = useRouter();

  const updateQueryParams = (params: Record<string, string | number>) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.set(key, value.toString());
    });

    router.replace(
      { pathname: router.pathname, query: queryParams.toString() },
      undefined,
      { shallow: true }
    );
  };

  return updateQueryParams;
};
