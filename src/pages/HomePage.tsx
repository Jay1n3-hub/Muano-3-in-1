import { Seo } from "../components/Seo";
import { designLayouts } from "../designs";
import { useDesign } from "../context/DesignContext";

export function HomePage() {
  const { design } = useDesign();
  const DesignLayout = designLayouts[design];

  return (
    <>
      <Seo
        description="Professional electronic security solutions for homes and businesses in South Africa. Explore CCTV, access control, alarms and more."
        title="Muanotronics | Smart Security. Intelligent Protection."
      />
      <main>
        <DesignLayout />
      </main>
    </>
  );
}
