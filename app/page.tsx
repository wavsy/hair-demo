import Faces from "@/components/Faces";
import Shell from "@/components/Shell";

export default function Home() {
  return (
    <Shell lang="bg" page={{ kind: "home" }}>
      <Faces />
    </Shell>
  );
}
