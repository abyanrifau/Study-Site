import Link from "next/link";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-10 text-center">
      <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-faint">
        Not found
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Nothing here
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
        That page, topic or paper does not exist. If you were opening a past paper, check the file
        is in the papers folder and named correctly.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/" className={buttonClass("primary")}>
          Home
        </Link>
        <Link href="/papers" className={buttonClass("secondary")}>
          Past papers
        </Link>
      </div>
    </div>
  );
}
