export interface Holding {
  symbol: string;
  name: string;
  qty: number;
  avg: number;
  current: number;
}

export interface PortfolioSummary {
  totalValue: number;
  todayPnL: number;
  totalReturn: number;
}

export const portfolio: PortfolioSummary = {
  totalValue: 2487500,
  todayPnL: 15420,
  totalReturn: 18.7,
};

export const holdings: Holding[] = [
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    qty: 12,
    avg: 3480,
    current: 3725,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    qty: 25,
    avg: 1420,
    current: 1585,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    qty: 8,
    avg: 1560,
    current: 1690,
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    qty: 10,
    avg: 2350,
    current: 2510,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    qty: 15,
    avg: 980,
    current: 1055,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    qty: 30,
    avg: 425,
    current: 398,
  },
];
