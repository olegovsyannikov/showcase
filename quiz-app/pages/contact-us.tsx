import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function ContactUs() {
  return (
    <DefaultLayout>
      <section className="flex flex-colgap-4 py-8 md:py-10">
        <h1 className={title()}>Contact us</h1>
      </section>
    </DefaultLayout>
  );
}
