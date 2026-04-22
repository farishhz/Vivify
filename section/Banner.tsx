import Image from "next/image";

export default function Banner() {
  return (
    <section className="w-full relative flex items-center justify-center">
      <Image
        src={"/footer/footer.png"}
        width={1720}
        height={400}
        alt="banner"
        className="absolute inset-0 h-full object-cover w-full"
      />
      <Image
        src={"/hero/logo/logo-white.svg"}
        alt="logo"
        width={500}
        height={500}
        className="relative lg:py-24 py-16 lg:w-120 w-72 h-auto"
      />
    </section>
  );
}
