import type { CSSProperties } from 'vue'
import QRCode from 'qrcode'

export interface CodeCardConfig {
  layout: 'eco' | 'fancy'
  qrPosition: 'left' | 'right'
  title: string
  titleColor: string
  codeFontColor: string
  codeBackgroundColor: string
  expiryColor: string
  expiryDate: string
  itemsDisplay: 'images' | 'text' | 'none'
  items: string[]
  itemsText: string
  backsideType: 'off' | 'logo' | 'qr' | 'custom'
  customBacksideUrl: string | null
}

export interface CodeCardGeneratorState {
  itemsDisplay: 'images' | 'text' | 'none'
  title: string
  titleColor: string
  rawInput: string
  separator: string
  expiryDate: string
  expiryColor: string
  codeFontColor: string
  codeBackgroundColor: string
  cardBackgroundColor: string
  cardBgImageUrl: string | null
  bgApplyTo: string[]
  cardLayout: 'eco' | 'fancy'
  qrPosition: 'left' | 'right'
  backsideType: 'off' | 'logo' | 'qr' | 'custom'
  customBacksideUrl: string | null
  duplexOffsetX: number
  paperSize: 'a4' | 'letter'
}

const ITEMS = [
  '/item_paid_raid_ticket.png',
  '/item_star_piece.png',
  '/item_incubator_basic.png',
  '/item_incense_ordinary.png'
]
const ITEMS_TEXT = 'Raid Pass, Star Piece, Incubator and Incense'

function getDefaultExpiryDate() {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const day = lastDay.getDate()
  const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'
  const month = lastDay.toLocaleString('en-US', { month: 'long' })
  const year = lastDay.getFullYear()
  return `${month} ${day}${suffix} ${year} at 12:00:00 AM UTC`
}

function resizeImageToDataUrl(file: File, width: number, height: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = objectUrl
  })
}

// Reverse each row of 3 so backs align when printed double-sided (flip on long edge)
export function backOrder(page: string[]): (string | null)[] {
  const result: (string | null)[] = []
  for (let i = 0; i < page.length; i += 3) {
    const row: (string | null)[] = page.slice(i, i + 3)
    while (row.length < 3) row.push(null)
    result.push(...row.toReversed())
  }
  return result
}

export function useCodeCardGenerator() {
  const state: CodeCardGeneratorState = reactive({
    itemsDisplay: 'images',
    title: 'Wurzelheim Alexanderplatz',
    titleColor: '#000000',
    rawInput: '',
    separator: ',',
    expiryDate: getDefaultExpiryDate(),
    expiryColor: '#000000',
    codeFontColor: '#000000',
    codeBackgroundColor: '#ffffff',
    cardBackgroundColor: '',
    cardBgImageUrl: null,
    bgApplyTo: ['front', 'back'],
    cardLayout: 'eco',
    qrPosition: 'right',
    backsideType: 'off',
    customBacksideUrl: null,
    duplexOffsetX: -3, // in mm, negative shifts left, positive shifts right
    paperSize: 'a4'
  })

  const clearBgImage = () => {
    state.cardBgImageUrl = null
    state.cardBackgroundColor = ''
  }

  const onBgImageChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    state.cardBackgroundColor = file.name
    state.cardBgImageUrl = await resizeImageToDataUrl(file, 744, 396)
  }

  const onFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      state.customBacksideUrl = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  watch(
    () => state.cardLayout,
    (val) => {
      if (val === 'eco' && state.backsideType === 'qr') {
        state.backsideType = 'off'
      }
    }
  )

  const cardBackgroundStyle = computed<CSSProperties>(() => ({
    backgroundColor: state.cardBackgroundColor || 'transparent',
    ...(state.cardBgImageUrl && {
      backgroundImage: `url(${state.cardBgImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    })
  }))

  const frontCardStyle = computed<CSSProperties>(() =>
    state.bgApplyTo.includes('front') ? cardBackgroundStyle.value : {}
  )
  const backCardStyle = computed<CSSProperties>(() =>
    state.bgApplyTo.includes('back') ? cardBackgroundStyle.value : {}
  )

  const backsideGridStyle = computed<CSSProperties>(() =>
    state.duplexOffsetX ? { transform: `translateX(${state.duplexOffsetX}mm)` } : {}
  )

  const codes = computed(() =>
    state.rawInput
      .split(state.separator)
      .map((s) => s.trim())
      .filter(Boolean)
  )

  const pages = computed(() => {
    const result: string[][] = []
    for (let i = 0; i < codes.value.length; i += 24) {
      result.push(codes.value.slice(i, i + 24))
    }
    return result
  })

  const qrDataUrls = ref<Record<string, string>>({})

  watch(
    codes,
    async (newCodes) => {
      const entries = await Promise.all(
        newCodes.map(async (code) => {
          const url = await QRCode.toDataURL(
            `https://store.pokemongo.com/offer-redemption?passcode=${code}`,
            { margin: 1, width: 200 }
          )
          return [code, url] as const
        })
      )
      qrDataUrls.value = Object.fromEntries(entries)
    },
    { immediate: true }
  )

  const cardConfig = computed<CodeCardConfig>(() => ({
    layout: state.cardLayout,
    qrPosition: state.qrPosition,
    title: state.title,
    titleColor: state.titleColor,
    codeFontColor: state.codeFontColor,
    codeBackgroundColor: state.codeBackgroundColor,
    expiryColor: state.expiryColor,
    expiryDate: state.expiryDate,
    itemsDisplay: state.itemsDisplay,
    items: ITEMS,
    itemsText: ITEMS_TEXT,
    backsideType: state.backsideType,
    customBacksideUrl: state.customBacksideUrl
  }))

  const print = () => {
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'generate_pdf', {
      card_layout: state.cardLayout,
      backside_type: state.backsideType,
      paper_size: state.paperSize,
      code_count: codes.value.length,
      page_count: pages.value.length,
      title: state.title,
      expiry_date: state.expiryDate
    })
    window.print()
  }

  return {
    state,
    items: ITEMS,
    codes,
    pages,
    qrDataUrls,
    frontCardStyle,
    backCardStyle,
    backsideGridStyle,
    cardConfig,
    clearBgImage,
    onBgImageChange,
    onFileChange,
    print
  }
}
