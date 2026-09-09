import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata } from "@/data/guidesEn";

export const metadata = buildEnMetadata("jeonse-scam");

export default function EnJeonseScamPage() {
  return (
    <EnShell id="jeonse-scam">
      <Sec title="Korea's deposit system in 60 seconds">
        <GuideTable
          headers={["Type", "How it works"]}
          rows={[
            ["Jeonse (전세)", "Huge refundable deposit (often 50–80% of the home value), little or no monthly rent, usually 2-year terms — the landlord must return every won when you leave"],
            ["Wolse (월세)", "Smaller deposit + monthly rent — lower risk, and what most foreigners start with"],
          ]}
        />
        <p>
          The catch: your jeonse deposit is effectively an{" "}
          <strong className="text-[#e8e8f0]">unsecured loan to the landlord</strong>.
          If the home is over-mortgaged or the owner disappears, tenants lose
          life savings — the &ldquo;jeonse scam&rdquo; waves you may have read
          about. Every check below exists to prevent exactly that.
        </p>
      </Sec>

      <Sec title="The 4 checks before you sign anything">
        <p>
          1. <strong className="text-[#e8e8f0]">Pull the property register</strong>{" "}
          (deungi-bu deungbon) at www.iros.go.kr — anyone can download it for
          under 1,000 won with just the address. Confirm the registered owner,
          and look for mortgages (geun-jeodang) in the debt section.
        </p>
        <p>
          2. <strong className="text-[#e8e8f0]">Verify the landlord in person</strong>{" "}
          — the ID of the person signing must match the register. A
          &ldquo;representative&rdquo; signing without a notarized power of
          attorney is a walk-away sign.
        </p>
        <p>
          3. <strong className="text-[#e8e8f0]">Use a licensed agent</strong> —
          check the license certificate on the office wall and that the agency
          carries liability insurance (loss coverage up to a legal limit).
        </p>
        <p>
          4. <strong className="text-[#e8e8f0]">Do the math</strong> — existing
          mortgage + your deposit should stay well under the real market price
          (under ~70–80%). If the deposit alone approaches the price of the
          home, that is the classic scam structure.
        </p>
      </Sec>

      <Sec title="After signing: three layers of protection">
        <p>
          1. <strong className="text-[#e8e8f0]">Register your residence at the
          address</strong> — for foreigners, reporting your place of stay to
          immigration (HiKorea or the local office) plays the role of the
          Korean move-in report and starts your legal standing as a tenant.
        </p>
        <p>
          2. <strong className="text-[#e8e8f0]">Fixed-date stamp</strong>{" "}
          (hwakjeong-ilja) — take the lease to the local community center (or
          online registry) for a date stamp. Residence + stamp gives your
          deposit priority over later creditors if the home is auctioned.
        </p>
        <p>
          3. <strong className="text-[#e8e8f0]">Deposit guarantee insurance</strong>{" "}
          — HUG&apos;s jeonse guarantee refunds your deposit if the landlord
          fails to. Foreigners with an ARC can subscribe for eligible homes.
          The premium is real money, and worth it.
        </p>
      </Sec>

      <Sec title="Walk-away red flags">
        <p>❌ Deposit at or above ~80% of the market price, or the agent cannot show comparable prices</p>
        <p>❌ Owner on the register ≠ person signing, or pressure to wire money before you saw the register</p>
        <p>❌ Brand-new villa (multi-unit) with no transaction history and a suspiciously generous move-in bonus</p>
        <p>❌ Anyone discouraging deposit insurance or the fixed-date stamp</p>
        <p>❌ Contract only in Korean and nobody will wait for a translation — take a Korean-speaking friend or interpreter (BBB 1588-5644) before signing</p>
      </Sec>
    </EnShell>
  );
}
