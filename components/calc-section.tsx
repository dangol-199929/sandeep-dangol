"use client"

import { ArrowRight, Building2, RefreshCw } from "lucide-react"
import { Manrope } from "next/font/google"
import { useEffect, useMemo, useRef, useState } from "react"

import {
    CalcAccordion,
    CalcAccordionContent,
    CalcAccordionItem,
    CalcAccordionTrigger,
} from "@/components/calc-ui/calc-accordion"
import { CalcButton } from "@/components/calc-ui/calc-button"
import { CalcCard } from "@/components/calc-ui/calc-card"
import { CalcInput } from "@/components/calc-ui/calc-input"
import { CalcRadioCard, CalcRadioGroup } from "@/components/calc-ui/calc-radio-group"
import {
    CalcSelect,
    CalcSelectContent,
    CalcSelectItem,
    CalcSelectTrigger,
    CalcSelectValue,
} from "@/components/calc-ui/calc-select"
import { CalcSwitch } from "@/components/calc-ui/calc-switch"
import { cn } from "@/lib/utils"

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800"],
    variable: "--font-manrope-calc",
})

const PROPERTY_LABELS = {
    house: "House",
    granny_flat: "Granny flat",
    townhouse: "Townhouse",
    apartment: "Apartment",
    office: "Office",
    warehouse: "Warehouse",
} as const

const BUILD_TYPE_LABELS = {
    new_build: "New build",
    knockdown_rebuild: "Knock-down & rebuild",
    reno_light: "Renovation (light)",
    reno_major: "Renovation (major)",
    extension: "Extension / addition",
    granny_flat: "Granny flat / secondary dwelling",
} as const

const WALL_LABELS = {
    brick_veneer: "Brick veneer",
    double_brick: "Double brick",
    reinforced_concrete: "Reinf. concrete",
} as const

const WALL_SUMMARY_LABELS = {
    brick_veneer: "Brick veneer",
    double_brick: "Double brick",
    reinforced_concrete: "Reinforced concrete",
} as const

const FINISH_LABELS = {
    economy: "Economy",
    standard: "Standard",
    premium: "Premium",
    luxury: "Luxury",
} as const

const FINISH_DESCRIPTIONS = {
    economy: "Budget-conscious",
    standard: "Most common",
    premium: "Upgraded finish",
    luxury: "Top-tier",
} as const

const STATE_LABELS = {
    NSW: "New South Wales",
    VIC: "Victoria",
    QLD: "Queensland",
    WA: "Western Australia",
    SA: "South Australia",
    TAS: "Tasmania",
    ACT: "Australian Capital Territory",
    NT: "Northern Territory",
} as const

const BASE_RATE = {
    house: 1800,
    granny_flat: 1900,
    townhouse: 1700,
    apartment: 1750,
    office: 1600,
    warehouse: 900,
} as const

const WALL_ADD = {
    brick_veneer: 0,
    double_brick: 100,
    reinforced_concrete: 220,
} as const

const FINISH_MULT = {
    economy: 0.85,
    standard: 1,
    premium: 1.15,
    luxury: 1.35,
} as const

const STATE_INDEX = {
    NSW: 1.06,
    VIC: 1.04,
    QLD: 1,
    WA: 1.05,
    SA: 0.98,
    TAS: 0.95,
    ACT: 1.08,
    NT: 1.1,
} as const

const YEAR_INDEX = {
    "2024": 1,
    "2025": 1.03,
    "2026": 1.06,
    "2027": 1.09,
    "2028": 1.12,
} as const

const ADDON_COST = {
    ducted: 18000,
    basement: 65000,
    mezzanine: 35000,
    elevator: 55000,
} as const

const DEFAULT_INPUTS = {
    propertyType: "granny_flat",
    state: "NSW",
    year: "2024",
    buildType: "new_build",
    floorArea: 800,
    bedrooms: 4,
    floors: 2,
    wallType: "brick_veneer",
    finish: "economy",
    ducted: false,
    basement: false,
    mezzanine: false,
    elevator: false,
    gstInclusive: false,
} as const

type PropertyType = keyof typeof PROPERTY_LABELS
type BuildType = keyof typeof BUILD_TYPE_LABELS
type WallType = keyof typeof WALL_LABELS
type FinishType = keyof typeof FINISH_LABELS
type StateType = keyof typeof STATE_LABELS
type YearType = keyof typeof YEAR_INDEX

type CalcInputs = {
    propertyType: PropertyType
    state: StateType
    year: YearType
    buildType: BuildType
    floorArea: number
    bedrooms: number
    floors: number
    wallType: WallType
    finish: FinishType
    ducted: boolean
    basement: boolean
    mezzanine: boolean
    elevator: boolean
    gstInclusive: boolean
}

type DisplayResult = {
    core: number
    selected: number
    low: number
    high: number
}

const EMPTY_RESULT: DisplayResult = {
    core: 0,
    selected: 0,
    low: 0,
    high: 0,
}

const currencyFormatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
    return currencyFormatter.format(Math.round(value))
}

function validateInputs(inputs: CalcInputs) {
    return {
        floorArea: inputs.floorArea >= 1 && inputs.floorArea <= 2000,
        bedrooms: inputs.bedrooms >= 0 && inputs.bedrooms <= 12,
        floors: inputs.floors >= 1 && inputs.floors <= 6,
    }
}

function computeEstimate(inputs: CalcInputs): DisplayResult {
    const base = BASE_RATE[inputs.propertyType] ?? 1800
    const wallAdd = WALL_ADD[inputs.wallType] ?? 0
    const finishMult = FINISH_MULT[inputs.finish] ?? 1
    const storeyMult = 1 + (Math.max(1, inputs.floors) - 1) * 0.05
    const bedroomMult = 1 + Math.max(0, inputs.bedrooms - 3) * 0.015
    const locIndex = (STATE_INDEX[inputs.state] ?? 1) * (YEAR_INDEX[inputs.year] ?? 1)

    const ratePerSqm = (base + wallAdd) * finishMult
    const coreBeforeAddons = ratePerSqm * inputs.floorArea * storeyMult * bedroomMult

    let addons = 0
    if (inputs.ducted) addons += ADDON_COST.ducted
    if (inputs.basement) addons += ADDON_COST.basement
    if (inputs.mezzanine) addons += ADDON_COST.mezzanine
    if (inputs.elevator) addons += ADDON_COST.elevator

    const core = coreBeforeAddons + addons
    let selected = core * locIndex
    let low = selected * 0.91
    let high = selected * 1.09

    if (inputs.gstInclusive) {
        selected *= 1.1
        low *= 1.1
        high *= 1.1
    }

    return { core, selected, low, high }
}

function StepperField({
    id,
    label,
    value,
    min,
    max,
    step,
    suffix,
    helper,
    errorMessage,
    hasError,
    onChange,
}: {
    id: string
    label: string
    value: number
    min: number
    max: number
    step: number
    suffix?: string
    helper?: string
    errorMessage: string
    hasError: boolean
    onChange: (value: number) => void
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-[13.5px] font-semibold text-[#262B32]">
                {label}
            </label>
            <div
                className={cn(
                    "flex h-12 overflow-hidden rounded-lg border-[1.5px] bg-white transition-[border-color,box-shadow]",
                    hasError
                        ? "border-[#B3261E] bg-[#FBEBE9]"
                        : "border-[#D2CCC0] hover:border-[#8A939E] focus-within:border-[#DD6B20] focus-within:ring-4 focus-within:ring-[#DD6B20]/25",
                )}
            >
                <CalcInput
                    id={id}
                    type="number"
                    inputMode="numeric"
                    value={Number.isNaN(value) ? "" : value}
                    min={min}
                    max={max}
                    onChange={(event) => onChange(Number(event.target.value))}
                    className="h-full rounded-none border-0 bg-transparent px-3.5 py-0 shadow-none hover:border-0 focus-visible:border-0 focus-visible:ring-0"
                />
                {suffix ? (
                    <span className="flex items-center pr-2 text-sm font-semibold text-[#8A939E]">
                        {suffix}
                    </span>
                ) : null}
                <button
                    type="button"
                    className="flex w-9 items-center justify-center border-l border-[#E3DFD7] bg-[#FAF8F5] text-base font-bold text-[#16344E] transition-colors hover:bg-[#FCEBDC]"
                    onClick={() => onChange(Math.max(min, Math.min(max, (value || 0) - step)))}
                    aria-label={`Decrease ${label.toLowerCase()}`}
                >
                    –
                </button>
                <button
                    type="button"
                    className="flex w-9 items-center justify-center border-l border-[#E3DFD7] bg-[#FAF8F5] text-base font-bold text-[#16344E] transition-colors hover:bg-[#FCEBDC]"
                    onClick={() => onChange(Math.max(min, Math.min(max, (value || 0) + step)))}
                    aria-label={`Increase ${label.toLowerCase()}`}
                >
                    +
                </button>
            </div>
            {helper ? <p className="text-[12.5px] text-[#8A939E]">{helper}</p> : null}
            {hasError ? <p className="text-[12.5px] font-medium text-[#B3261E]">{errorMessage}</p> : null}
        </div>
    )
}

function ToggleRow({
    title,
    description,
    checked,
    onCheckedChange,
    compact = false,
}: {
    title: string
    description: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    compact?: boolean
}) {
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-4 rounded-lg border px-4",
                compact
                    ? "border-[#E3DFD7] bg-white py-3"
                    : "border-[#E3DFD7] bg-[#FAF8F5] py-3.5",
            )}
        >
            <div>
                <p className="text-[14.5px] font-semibold text-[#262B32]">{title}</p>
                <p className="mt-0.5 text-[12.5px] text-[#5C6672]">{description}</p>
            </div>
            <CalcSwitch className="" checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    )
}

export default function CalcSection() {
    const [inputs, setInputs] = useState<CalcInputs>({ ...DEFAULT_INPUTS })
    const [displayResult, setDisplayResult] = useState<DisplayResult>(EMPTY_RESULT)
    const [isLoading, setIsLoading] = useState(true)
    const estimateRef = useRef<HTMLDivElement | null>(null)

    const validation = validateInputs(inputs)
    const isValid = Object.values(validation).every(Boolean)

    useEffect(() => {
        if (!isValid) {
            setIsLoading(true)
            setDisplayResult(EMPTY_RESULT)
            return
        }

        setIsLoading(true)
        const timer = window.setTimeout(() => {
            setDisplayResult(computeEstimate(inputs))
            setIsLoading(false)
        }, 260)

        return () => window.clearTimeout(timer)
    }, [inputs, isValid])

    const markerPosition = useMemo(() => {
        const rangeSpan = displayResult.high - displayResult.low || 1
        return Math.min(
            100,
            Math.max(0, ((displayResult.selected - displayResult.low) / rangeSpan) * 100),
        )
    }, [displayResult])

    const inputsSummary = [
        ["Property type", PROPERTY_LABELS[inputs.propertyType]],
        ["Build type", BUILD_TYPE_LABELS[inputs.buildType]],
        ["State", STATE_LABELS[inputs.state]],
        ["Completion year", inputs.year],
        ["Floor area", `${inputs.floorArea} m²`],
        ["Bedrooms", String(inputs.bedrooms)],
        ["Floors", String(inputs.floors)],
        ["Wall type", WALL_SUMMARY_LABELS[inputs.wallType]],
        ["Finish level", FINISH_LABELS[inputs.finish]],
        ["Ducted air-conditioning", inputs.ducted ? "Included" : "Not included"],
        ["Basement", inputs.basement ? "Included" : "Not included"],
        ["Mezzanine", inputs.mezzanine ? "Included" : "Not included"],
        ["Elevator", inputs.elevator ? "Included" : "Not included"],
    ]

    const setNumberField = (key: "floorArea" | "bedrooms" | "floors", value: number) => {
        setInputs((current) => ({
            ...current,
            [key]: Number.isFinite(value) ? value : 0,
        }))
    }

    return (
        <section
            className={cn(
                manrope.variable,
                "mx-auto bg-[#F5F3EF] px-4 py-10 text-[#262B32] sm:px-6 sm:py-12",
            )}
        >
            <div className="mx-auto mb-7 max-w-[1240px]">
                <span className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#B8540E] before:inline-block before:h-0.5 before:w-[18px] before:rounded-full before:bg-[#DD6B20]">
                    Construction Estimations
                </span>
                <h1 className="font-[var(--font-manrope-calc)] text-[clamp(28px,3.4vw,38px)] font-extrabold tracking-[-0.01em] text-[#0F2438]">
                    Construction Cost Calculator
                </h1>
                <p className="mt-2 max-w-[640px] text-base leading-6 text-[#5C6672]">
                    Estimate the cost to build your property in Australia. Enter your
                    project details and get an instant, indicative estimate tailored to your
                    build.
                </p>
            </div>

            <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-[1.82fr_1fr] lg:gap-7">
                <CalcCard className="min-w-0 p-4 sm:p-7 sm:pb-2">
                    <div className="mb-6 flex items-start gap-3.5 border-b border-[#E3DFD7] pb-5">
                        <div className="flex size-[42px] items-center justify-center rounded-[11px] bg-[#0F2438] text-white">
                            <Building2 className="size-[22px]" strokeWidth={1.8} />
                        </div>
                        <div>
                            <h2 className="font-[var(--font-manrope-calc)] text-[19px] font-bold text-[#0F2438]">
                                Your project details
                            </h2>
                            <p className="mt-1 text-sm text-[#5C6672]">
                                Tell us about the build. Your estimate updates automatically.
                            </p>
                        </div>
                    </div>

                    <fieldset className="mb-7 border-0 p-0">
                        <legend className="mb-4 flex items-center gap-2.5 font-[var(--font-manrope-calc)] text-sm font-bold text-[#16344E]">
                            <span className="flex size-[22px] items-center justify-center rounded-full bg-[#FCEBDC] text-xs font-extrabold text-[#B8540E]">
                                1
                            </span>
                            Property details
                        </legend>
                        <div className="grid gap-x-5 gap-y-[18px] sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="block text-[13.5px] font-semibold text-[#262B32]">
                                    Investment property type
                                </label>
                                <CalcSelect
                                    value={inputs.propertyType}
                                    onValueChange={(value) =>
                                        setInputs((current) => ({
                                            ...current,
                                            propertyType: value as PropertyType,
                                        }))
                                    }
                                >
                                    <CalcSelectTrigger>
                                        <CalcSelectValue />
                                    </CalcSelectTrigger>
                                    <CalcSelectContent>
                                        {Object.entries(PROPERTY_LABELS).map(([value, label]) => (
                                            <CalcSelectItem key={value} value={value}>
                                                {label}
                                            </CalcSelectItem>
                                        ))}
                                    </CalcSelectContent>
                                </CalcSelect>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13.5px] font-semibold text-[#262B32]">
                                    Investment property state
                                </label>
                                <CalcSelect
                                    value={inputs.state}
                                    onValueChange={(value) =>
                                        setInputs((current) => ({
                                            ...current,
                                            state: value as StateType,
                                        }))
                                    }
                                >
                                    <CalcSelectTrigger>
                                        <CalcSelectValue />
                                    </CalcSelectTrigger>
                                    <CalcSelectContent>
                                        {Object.entries(STATE_LABELS).map(([value, label]) => (
                                            <CalcSelectItem key={value} value={value}>
                                                {label}
                                            </CalcSelectItem>
                                        ))}
                                    </CalcSelectContent>
                                </CalcSelect>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13.5px] font-semibold text-[#262B32]">
                                    Construction completion year
                                </label>
                                <CalcSelect
                                    value={inputs.year}
                                    onValueChange={(value) =>
                                        setInputs((current) => ({
                                            ...current,
                                            year: value as YearType,
                                        }))
                                    }
                                >
                                    <CalcSelectTrigger>
                                        <CalcSelectValue />
                                    </CalcSelectTrigger>
                                    <CalcSelectContent>
                                        {Object.keys(YEAR_INDEX).map((year) => (
                                            <CalcSelectItem key={year} value={year}>
                                                {year}
                                            </CalcSelectItem>
                                        ))}
                                    </CalcSelectContent>
                                </CalcSelect>
                                <p className="text-[12.5px] text-[#8A939E]">
                                    Costs are indexed to your expected completion year.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13.5px] font-semibold text-[#262B32]">
                                    Build type
                                </label>
                                <CalcSelect
                                    value={inputs.buildType}
                                    onValueChange={(value) =>
                                        setInputs((current) => ({
                                            ...current,
                                            buildType: value as BuildType,
                                        }))
                                    }
                                >
                                    <CalcSelectTrigger>
                                        <CalcSelectValue />
                                    </CalcSelectTrigger>
                                    <CalcSelectContent>
                                        {Object.entries(BUILD_TYPE_LABELS).map(([value, label]) => (
                                            <CalcSelectItem key={value} value={value}>
                                                {label}
                                            </CalcSelectItem>
                                        ))}
                                    </CalcSelectContent>
                                </CalcSelect>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="mb-7 border-0 p-0">
                        <legend className="mb-4 flex items-center gap-2.5 font-[var(--font-manrope-calc)] text-sm font-bold text-[#16344E]">
                            <span className="flex size-[22px] items-center justify-center rounded-full bg-[#FCEBDC] text-xs font-extrabold text-[#B8540E]">
                                2
                            </span>
                            Size and structure
                        </legend>
                        <div className="grid gap-x-5 gap-y-[18px] sm:grid-cols-2">
                            <StepperField
                                id="floorArea"
                                label="Floor area"
                                value={inputs.floorArea}
                                min={1}
                                max={2000}
                                step={10}
                                suffix="m²"
                                helper="Total internal floor area across all storeys."
                                errorMessage="Enter a floor area between 1 and 2,000 m²."
                                hasError={!validation.floorArea}
                                onChange={(value) => setNumberField("floorArea", value)}
                            />
                            <StepperField
                                id="bedrooms"
                                label="How many bedrooms?"
                                value={inputs.bedrooms}
                                min={0}
                                max={12}
                                step={1}
                                errorMessage="Enter a value between 0 and 12."
                                hasError={!validation.bedrooms}
                                onChange={(value) => setNumberField("bedrooms", value)}
                            />
                            <StepperField
                                id="floors"
                                label="Number of floors / storeys"
                                value={inputs.floors}
                                min={1}
                                max={6}
                                step={1}
                                errorMessage="Enter a value between 1 and 6."
                                hasError={!validation.floors}
                                onChange={(value) => setNumberField("floors", value)}
                            />

                            <div className="space-y-1.5">
                                <span className="block text-[13.5px] font-semibold text-[#262B32]">
                                    Wall type
                                </span>
                                <CalcRadioGroup
                                    value={inputs.wallType}
                                    onValueChange={(value) =>
                                        setInputs((current) => ({
                                            ...current,
                                            wallType: value as WallType,
                                        }))
                                    }
                                    className="grid grid-cols-1 gap-2.5 sm:grid-cols-3"
                                >
                                    {Object.entries(WALL_LABELS).map(([value, label]) => (
                                        <CalcRadioCard key={value} value={value} title={label} />
                                    ))}
                                </CalcRadioGroup>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border-0 p-0">
                        <legend className="mb-4 flex items-center gap-2.5 font-[var(--font-manrope-calc)] text-sm font-bold text-[#16344E]">
                            <span className="flex size-[22px] items-center justify-center rounded-full bg-[#FCEBDC] text-xs font-extrabold text-[#B8540E]">
                                3
                            </span>
                            Quality and inclusions
                        </legend>

                        <div className="mb-5 space-y-2">
                            <span className="block text-[13.5px] font-semibold text-[#262B32]">
                                Specification / finish level
                            </span>
                            <CalcRadioGroup
                                value={inputs.finish}
                                onValueChange={(value) =>
                                    setInputs((current) => ({
                                        ...current,
                                        finish: value as FinishType,
                                    }))
                                }
                                className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
                            >
                                {Object.entries(FINISH_LABELS).map(([value, label]) => (
                                    <CalcRadioCard
                                        key={value}
                                        value={value}
                                        title={label}
                                        description={FINISH_DESCRIPTIONS[value as FinishType]}
                                    />
                                ))}
                            </CalcRadioGroup>
                        </div>

                        <div className="space-y-2.5">
                            <ToggleRow
                                title="Ducted air-conditioning"
                                description="Includes the cost of a fully installed ducted system."
                                checked={inputs.ducted}
                                onCheckedChange={(ducted) =>
                                    setInputs((current) => ({ ...current, ducted }))
                                }
                            />
                            <ToggleRow
                                title="Basement"
                                description="Excavated lower-level space."
                                checked={inputs.basement}
                                onCheckedChange={(basement) =>
                                    setInputs((current) => ({ ...current, basement }))
                                }
                            />
                            <ToggleRow
                                title="Mezzanine"
                                description="Partial intermediate floor level."
                                checked={inputs.mezzanine}
                                onCheckedChange={(mezzanine) =>
                                    setInputs((current) => ({ ...current, mezzanine }))
                                }
                            />
                            <ToggleRow
                                title="Elevator"
                                description="Internal passenger lift."
                                checked={inputs.elevator}
                                onCheckedChange={(elevator) =>
                                    setInputs((current) => ({ ...current, elevator }))
                                }
                            />
                        </div>
                    </fieldset>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E3DFD7] py-5 md:flex-row md:items-center md:justify-between">
                        <CalcButton
                            variant="ghost"
                            size="sm"
                            className="self-center md:self-auto"
                            onClick={() => setInputs({ ...DEFAULT_INPUTS })}
                        >
                            <RefreshCw className="size-[15px]" />
                            Reset calculator
                        </CalcButton>
                        <CalcButton
                            className="md:hidden"
                            onClick={() =>
                                estimateRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                })
                            }
                        >
                            Update estimate
                        </CalcButton>
                    </div>
                </CalcCard>

                <div className="lg:sticky lg:top-5 lg:self-start">
                    <CalcCard className="p-5 sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-[var(--font-manrope-calc)] text-lg font-bold text-[#0F2438]">
                                Your estimate
                            </h2>
                        </div>
                        <div className="mb-[18px] h-[3px] w-[34px] rounded-full bg-[#1E7A54]" />

                        <div className="mb-3.5 flex items-center justify-between gap-3 text-[12.5px] text-[#5C6672]">
                            <span>
                                Showing estimate{" "}
                                <strong>
                                    {inputs.gstInclusive ? "including GST" : "excluding GST"}
                                </strong>
                            </span>
                            <CalcSwitch
                                checked={inputs.gstInclusive}
                                onCheckedChange={(gstInclusive) =>
                                    setInputs((current) => ({ ...current, gstInclusive }))
                                }
                            // className="h-5 w-[34px]"
                            />
                        </div>

                        <div
                            ref={estimateRef}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F2438] to-[#16344E] p-5 text-white"
                        >
                            <div className="mb-1.5 flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#BFD1DF]">
                                Finish (selected)
                                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold tracking-[0.02em] text-white normal-case">
                                    {FINISH_LABELS[inputs.finish]}
                                </span>
                            </div>
                            <div
                                className={cn(
                                    "font-[var(--font-manrope-calc)] text-[clamp(26px,4.4vw,38px)] font-extrabold leading-none tracking-[-0.01em] transition-opacity",
                                    isLoading && "opacity-35",
                                )}
                            >
                                {formatCurrency(displayResult.selected)}
                            </div>
                            {isLoading ? (
                                <div className="absolute top-[52px] right-[22px] left-[22px] h-[30px] animate-pulse rounded-md bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_25%,rgba(255,255,255,0.18)_37%,rgba(255,255,255,0.08)_63%)] bg-[length:400%_100%]" />
                            ) : null}
                        </div>

                        <div className="mt-[18px]">
                            <div className="mb-2 flex items-center justify-between text-[13px] font-semibold text-[#262B32]">
                                <span>{formatCurrency(displayResult.low)}</span>
                                <span>{formatCurrency(displayResult.high)}</span>
                            </div>
                            <div className="relative mb-1.5 h-2 rounded-full border border-[#E3DFD7] bg-[#FAF8F5]">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FBE1CB] to-[#DD6B20]" />
                                <div
                                    className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-[3px] border-[#B8540E] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left]"
                                    style={{ left: `${markerPosition}%`, transform: "translate(-50%, -50%)" }}
                                />
                            </div>
                            <div className="flex justify-between px-px" aria-hidden="true">
                                {Array.from({ length: 11 }).map((_, index) => (
                                    <span key={index} className="h-[5px] w-px bg-[#D2CCC0]" />
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between border-t border-[#E3DFD7] py-[11px] text-sm">
                                <span className="flex items-center font-medium text-[#5C6672]">
                                    <span className="mr-[9px] size-2 rounded-full bg-[#8A939E]" />
                                    Low estimate
                                </span>
                                <span className="font-[var(--font-manrope-calc)] text-[15px] font-bold text-[#0F2438]">
                                    {formatCurrency(displayResult.low)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#E3DFD7] py-[11px] text-sm">
                                <span className="flex items-center font-medium text-[#5C6672]">
                                    <span className="mr-[9px] size-2 rounded-full bg-[#DD6B20]" />
                                    High estimate
                                </span>
                                <span className="font-[var(--font-manrope-calc)] text-[15px] font-bold text-[#0F2438]">
                                    {formatCurrency(displayResult.high)}
                                </span>
                            </div>
                        </div>

                        <p className="mt-3.5 text-xs leading-[1.5] text-[#8A939E]">
                            This is an indicative estimate based on the details provided, not a
                            formal quotation. Actual construction costs vary by site
                            conditions, council requirements and builder.
                        </p>

                        <div className="mt-[22px] rounded-xl border border-[#E3DFD7] bg-[#FAF8F5] p-5">
                            <h3 className="font-[var(--font-manrope-calc)] text-base font-bold text-[#0F2438]">
                                Need a detailed cost breakdown?
                            </h3>
                            <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[#5C6672]">
                                Get a comprehensive Initial Cost Report prepared by Duo Tax.
                            </p>
                            <CalcButton variant="accent" size="lg" className="mt-4 w-full">
                                Order Initial Cost Report
                                <ArrowRight className="size-4" />
                            </CalcButton>
                        </div>
                    </CalcCard>
                </div>
            </div>

            <CalcCard className="mx-auto mt-9 max-w-[1240px] p-4 sm:p-7">
                <div className="mb-5">
                    <h2 className="font-[var(--font-manrope-calc)] text-xl font-bold text-[#0F2438]">
                        How your estimate is calculated
                    </h2>
                    <div className="mt-2.5 h-[3px] w-[34px] rounded-full bg-[#DD6B20]" />
                </div>

                <CalcAccordion type="multiple" defaultValue={["inputs"]}>
                    <CalcAccordionItem value="inputs">
                        <CalcAccordionTrigger>Your inputs</CalcAccordionTrigger>
                        <CalcAccordionContent>
                            <dl className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-x-5 gap-y-3 rounded-lg border border-[#E3DFD7] bg-[#FAF8F5] px-[18px] py-4">
                                {inputsSummary.map(([label, value]) => (
                                    <div key={label}>
                                        <dt className="mb-1 text-xs font-medium uppercase tracking-[0.03em] text-[#8A939E]">
                                            {label}
                                        </dt>
                                        <dd className="m-0 text-[13.5px] font-semibold text-[#262B32]">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </CalcAccordionContent>
                    </CalcAccordionItem>

                    <CalcAccordionItem value="calculated">
                        <CalcAccordionTrigger>How we calculated it</CalcAccordionTrigger>
                        <CalcAccordionContent>
                            <ol className="space-y-3">
                                {[
                                    "We set a base build rate per square metre from your property type, wall type and finish level.",
                                    "The rate is scaled by your floor area, then adjusted for storeys and bedroom count.",
                                    "Selected extras (ducted air-conditioning, basement, mezzanine, elevator) are added at fixed allowances.",
                                    "The result is adjusted using a location and year index for your state and completion year.",
                                ].map((item, index) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0F2438] text-xs font-bold text-white">
                                            {index + 1}
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ol>
                            <p className="mt-4">
                                Estimated core build cost before extras:{" "}
                                <strong>{formatCurrency(displayResult.core)}</strong>
                            </p>
                        </CalcAccordionContent>
                    </CalcAccordionItem>

                    <CalcAccordionItem value="affects">
                        <CalcAccordionTrigger>What affects your estimate</CalcAccordionTrigger>
                        <CalcAccordionContent>
                            <ul className="list-disc space-y-1.5 pl-5">
                                <li>Property type sets a base allowance per square metre.</li>
                                <li>Wall type adds to the base rate (brick veneer / double brick / reinforced concrete).</li>
                                <li>Selected extras add fixed amounts on top of the base.</li>
                                <li>Storeys and bedrooms apply small scaling multipliers.</li>
                                <li>Floor area scales the whole result.</li>
                                <li>Your state and completion year apply a location and time index.</li>
                            </ul>
                        </CalcAccordionContent>
                    </CalcAccordionItem>

                    <CalcAccordionItem value="totals">
                        <CalcAccordionTrigger>Estimate totals</CalcAccordionTrigger>
                        <CalcAccordionContent>
                            <dl className="grid gap-3 rounded-lg border border-[#CFE7DA] bg-[#E7F4EE] px-[18px] py-4 sm:grid-cols-3">
                                <div>
                                    <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.03em] text-[#1E7A54]">
                                        Low
                                    </dt>
                                    <dd className="m-0 font-[var(--font-manrope-calc)] text-[17px] font-extrabold text-[#0F2438]">
                                        {formatCurrency(displayResult.low)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.03em] text-[#1E7A54]">
                                        Finish (selected)
                                    </dt>
                                    <dd className="m-0 font-[var(--font-manrope-calc)] text-[17px] font-extrabold text-[#0F2438]">
                                        {formatCurrency(displayResult.selected)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.03em] text-[#1E7A54]">
                                        High
                                    </dt>
                                    <dd className="m-0 font-[var(--font-manrope-calc)] text-[17px] font-extrabold text-[#0F2438]">
                                        {formatCurrency(displayResult.high)}
                                    </dd>
                                </div>
                            </dl>
                            <p className="mt-3 text-[12.5px] text-[#5C6672]">
                                {inputs.gstInclusive
                                    ? "Totals shown include GST (×1.10). Toggle above to view ex-GST figures."
                                    : "Totals shown exclude GST. Toggle GST-inclusive above to add 10%."}
                            </p>
                        </CalcAccordionContent>
                    </CalcAccordionItem>

                    <CalcAccordionItem value="assumptions">
                        <CalcAccordionTrigger>Important assumptions</CalcAccordionTrigger>
                        <CalcAccordionContent>
                            <p className="rounded-lg border border-[#E3DFD7] bg-[#FAF8F5] px-4 py-3.5 text-[13px] leading-[1.6] text-[#5C6672]">
                                This calculator provides a general, indicative estimate only. It
                                does not constitute a formal quotation, tender price or valuation,
                                and does not account for site-specific factors such as soil
                                conditions, slope, demolition, council requirements, or design
                                complexity. For a detailed, site-specific assessment, order an
                                Initial Cost Report.
                            </p>
                        </CalcAccordionContent>
                    </CalcAccordionItem>
                </CalcAccordion>
            </CalcCard>
        </section>
    )
}
