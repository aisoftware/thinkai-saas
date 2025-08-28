import clsx from "clsx";
import { useNavigation } from "react-router";

interface Props {
  small?: boolean;
  loading?: boolean;
}
export default function Loading({ small = false, loading }: Props) {
  const navigation = useNavigation();
  return (
    <>
      {(navigation.state === "submitting" || navigation.state === "loading" || loading) && (
        <div className="space-y-2 pb-4 pt-4 text-center">
          <div className={clsx("flex h-auto w-full flex-col justify-center space-y-4 py-12 text-center", small && "py-2")}>
            <div className={clsx("loader border-border mx-auto rounded-full ease-linear", small ? "h-10 w-10 border-4" : "h-20 w-20 border-4")}></div>
          </div>
        </div>
      )}
    </>
  );
}
