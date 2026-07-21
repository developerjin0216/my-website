// 주택용 전기요금 계산 (한국전력 주택용 요금표 기준)
// 단가 변경 시 아래 상수만 수정하면 전기요금·에어컨 계산기에 모두 반영됩니다.

export type Contract = "low" | "high"; // 저압(일반 가정) / 고압(아파트 고압 수전)

const RATES = {
  low: {
    base: [910, 1600, 7300], // 구간별 기본요금 (원/호)
    energy: [120.0, 214.6, 307.3], // 구간별 전력량요금 (원/kWh)
    superUser: 736.2, // 하계·동계 1,000kWh 초과분 (원/kWh)
  },
  high: {
    base: [730, 1260, 6060],
    energy: [105.0, 174.0, 242.3],
    superUser: 601.3,
  },
};

const CLIMATE_RATE = 9.0; // 기후환경요금 (원/kWh)
const FUEL_RATE = 5.0; // 연료비조정요금 (원/kWh)
const VAT_RATE = 0.1; // 부가가치세
const FUND_RATE = 0.027; // 전력산업기반기금 (2025.7~ 2.7%)

// 누진 구간 경계: 하계(7~8월)는 완화된 구간 적용
const TIERS_OTHER = [200, 400];
const TIERS_SUMMER = [300, 450];

export interface ElectricityBill {
  kwh: number;
  tier: number; // 도달한 누진 구간 (1~3)
  baseFee: number;
  energyFee: number;
  climateFee: number;
  fuelFee: number;
  subtotal: number; // 전기요금계
  vat: number;
  fund: number;
  total: number; // 청구금액 (10원 미만 절사)
}

export function calcResidentialBill(
  kwh: number,
  month: number, // 1~12 (7·8월 하계 구간, 슈퍼유저는 하계·동계만)
  contract: Contract = "low"
): ElectricityBill {
  const rate = RATES[contract];
  const summer = month === 7 || month === 8;
  const winter = month === 12 || month === 1 || month === 2;
  const tiers = summer ? TIERS_SUMMER : TIERS_OTHER;

  const usage = Math.max(0, kwh);
  let tier = 1;
  if (usage > tiers[1]) tier = 3;
  else if (usage > tiers[0]) tier = 2;

  const baseFee = usage > 0 ? rate.base[tier - 1] : 0;

  const t1 = Math.min(usage, tiers[0]);
  const t2 = Math.min(Math.max(usage - tiers[0], 0), tiers[1] - tiers[0]);
  let t3 = Math.max(usage - tiers[1], 0);
  let superKwh = 0;
  if ((summer || winter) && usage > 1000) {
    superKwh = usage - 1000;
    t3 -= superKwh;
  }
  const energyFee =
    t1 * rate.energy[0] +
    t2 * rate.energy[1] +
    t3 * rate.energy[2] +
    superKwh * rate.superUser;

  const climateFee = usage * CLIMATE_RATE;
  const fuelFee = usage * FUEL_RATE;

  const subtotal = Math.floor(baseFee + energyFee + climateFee + fuelFee);
  const vat = Math.round(subtotal * VAT_RATE);
  const fund = Math.floor((subtotal * FUND_RATE) / 10) * 10;
  const total = Math.floor((subtotal + vat + fund) / 10) * 10;

  return { kwh: usage, tier, baseFee, energyFee, climateFee, fuelFee, subtotal, vat, fund, total };
}
