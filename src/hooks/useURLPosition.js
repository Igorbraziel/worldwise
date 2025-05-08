import { useSearchParams } from "react-router-dom";

export default function useURLPosition() {
  const [searchParams] = useSearchParams();
  return [searchParams.get("lat"), searchParams.get("lng")];
}
