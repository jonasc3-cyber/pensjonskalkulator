# Pensjonskalkulator

Forenklet, norsk (bokmål) pensjonskalkulator bygget med Next.js.
**Personvern først:** all matematikk kjører i nettleseren — ingen serverlagring av dine tall.
Resultatene vises som **intervaller** (pessimistisk / basis / optimistisk).

## Kom i gang

```bash
cd pensjonskalkulator
bun install
bun run dev
bun run build
bun test
```

Ekvivalent med Node-pakkeverktøy: `install`, `run dev`, `run build`, `test` via package.json-scripts.

## Sider

- `/` — hovedkalkulator
- `/om` — modell, kilder, personvern og VERIFY-konstanter

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Recharts for diagrammer
- Vitest for enhetstester av kjernematematikk
- `nb-NO` tallformatering

## Modell (kort)

- **Folketrygd (ny, født 1963+):** 18,1 % av inntekt opp til 7,1 G → beholdning / forenklet delingstall
- **TP (OTP):** sats × min(lønn, 12 G), rentes rente, utbetaling over N år eller forenklet livsvarig
- **AFP:** grovt tillegg merket «forenkling»
- **Egen sparing:** FV + annuitet
- **Garantipensjon:** forenklet gulv etter sivilstatus

Se `lib/constants.ts` for verdier merket **VERIFY** (spesielt G / grunnbeløp).

## Begrensninger

Ikke BankID, Altinn, Norsk Pensjon-API, full AFP, eller gammel opptjeningsmodell i detalj.
Bruk [NAV](https://www.nav.no/pensjon) og [Norsk Pensjon](https://www.norskpensjon.no) for offisielle tall.
