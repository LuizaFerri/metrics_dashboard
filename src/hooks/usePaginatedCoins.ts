import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CACHE_TIMES } from '@/constants/api'
import type { CoinGeckoMarketData } from '@/types/api'

interface PaginationConfig {
  itemsPerPage: number
  maxTotalItems?: number
}

const DEFAULT_CONFIG: PaginationConfig = {
  itemsPerPage: 20,
  maxTotalItems: 100
}

export function usePaginatedCoins(config: Partial<PaginationConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const [currentPage, setCurrentPage] = useState(1)

  const { data: allCoins = [], isLoading, error } = useQuery({
    queryKey: ['paginated-coins', finalConfig.maxTotalItems],
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${finalConfig.maxTotalItems}&page=1&sparkline=false`
      )
      
      if (!response.ok) {
        throw new Error('Falha ao buscar lista de moedas')
      }
      
      const data = await response.json()
      return data as CoinGeckoMarketData[]
    },
    staleTime: CACHE_TIMES.MARKET_DATA * 5, 
    retry: 2,
  })

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * finalConfig.itemsPerPage
    const endIndex = startIndex + finalConfig.itemsPerPage
    
    return {
      items: allCoins.slice(startIndex, endIndex),
      totalItems: allCoins.length,
      totalPages: Math.ceil(allCoins.length / finalConfig.itemsPerPage),
      currentPage,
      hasNextPage: endIndex < allCoins.length,
      hasPreviousPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, allCoins.length)
    }
  }, [allCoins, currentPage, finalConfig.itemsPerPage])

  const goToPage = useCallback((page: number) => {
    const maxPage = Math.ceil(allCoins.length / finalConfig.itemsPerPage)
    setCurrentPage(Math.max(1, Math.min(page, maxPage)))
  }, [allCoins.length, finalConfig.itemsPerPage])

  const nextPage = useCallback(() => {
    if (paginatedData.hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }, [paginatedData.hasNextPage])

  const previousPage = useCallback(() => {
    if (paginatedData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }, [paginatedData.hasPreviousPage])

  const firstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const lastPage = useCallback(() => {
    const maxPage = Math.ceil(allCoins.length / finalConfig.itemsPerPage)
    setCurrentPage(maxPage)
  }, [allCoins.length, finalConfig.itemsPerPage])

  const filterCoins = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return allCoins
    
    const term = searchTerm.toLowerCase()
    return allCoins.filter(coin => 
      coin.name.toLowerCase().includes(term) ||
      coin.symbol.toLowerCase().includes(term) ||
      coin.id.toLowerCase().includes(term)
    )
  }, [allCoins])

  return {
    ...paginatedData,
    
    isLoading,
    error,
    
    
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    
    
    filterCoins,
    config: finalConfig,
    
    
    allCoins
  }
}


export function useExpandedCoinList() {
  const { 
    items, 
    isLoading, 
    error, 
    nextPage, 
    previousPage, 
    hasNextPage, 
    hasPreviousPage,
    currentPage,
    totalPages,
    totalItems
  } = usePaginatedCoins({ itemsPerPage: 10, maxTotalItems: 50 })

  return {
    coins: items,
    isLoading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage
    }
  }
}
