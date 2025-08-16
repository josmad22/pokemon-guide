"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import guideData from "@/data/pokemon-guide.json"

interface Pokemon {
  id: string
  name: string
  image: string
  tricks: string[]
}

interface Elite {
  id: string
  name: string
  image: string
  pokemon: Pokemon[]
}

interface Region {
  id: string
  name: string
  image: string
  elites: Elite[]
}

interface GuideData {
  title: string
  subtitle: string
  regions: Region[]
}

export default function PokemonGuide() {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)
  const [expandedElite, setExpandedElite] = useState<string | null>(null)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [lightMode, setLightMode] = useState(false)

  const data = guideData as GuideData

  const handleRegionClick = (regionId: string) => {
    if (expandedRegion === regionId) {
      setExpandedRegion(null)
      setExpandedElite(null)
      setSelectedPokemon(null)
    } else {
      setExpandedRegion(regionId)
      setExpandedElite(null)
      setSelectedPokemon(null)
    }
  }

  const handleEliteClick = (eliteId: string) => {
    if (expandedElite === eliteId) {
      setExpandedElite(null)
      setSelectedPokemon(null)
    } else {
      setExpandedElite(eliteId)
      setSelectedPokemon(null)
    }
  }

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(selectedPokemon?.id === pokemon.id ? null : pokemon)
  }

  const currentRegion = data.regions.find((r) => r.id === expandedRegion)
  const currentElite = currentRegion?.elites.find((e) => e.id === expandedElite)

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        lightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
          <p className="text-gray-400 mb-4">{data.subtitle}</p>

          {/* Tips Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <ChevronDown className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Tips</span>
          </div>
        </div>

        {/* Regions Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {data.regions.map((region) => (
            <div
              key={region.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                expandedRegion === region.id
                  ? "ring-2 ring-blue-400 transform scale-105"
                  : "hover:transform hover:scale-102"
              }`}
              onClick={() => handleRegionClick(region.id)}
            >
              <img src={region.image || "/placeholder.svg"} alt={region.name} className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{region.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Elites Row */}
        {expandedRegion && currentRegion && currentRegion.elites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 animate-in slide-in-from-top duration-300">
            {currentRegion.elites.map((elite) => (
              <div
                key={elite.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  expandedElite === elite.id
                    ? "ring-2 ring-red-400 transform scale-105"
                    : "hover:transform hover:scale-102"
                }`}
                onClick={() => handleEliteClick(elite.id)}
              >
                <img src={elite.image || "/placeholder.svg"} alt={elite.name} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{elite.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pokemon Grid */}
        {expandedElite && currentElite && (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {currentElite.pokemon.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedPokemon?.id === pokemon.id
                      ? "ring-2 ring-yellow-400 transform scale-110"
                      : "hover:transform hover:scale-105"
                  }`}
                  onClick={() => handlePokemonClick(pokemon)}
                >
                  <img
                    src={pokemon.image || "/placeholder.svg"}
                    alt={pokemon.name}
                    className="w-full h-16 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                    <span className="text-white text-xs font-medium p-1 w-full text-center bg-black bg-opacity-50">
                      {pokemon.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pokemon Details */}
        {selectedPokemon && (
          <div className="bg-gray-800 rounded-lg p-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>Use Trick:</span>
            </h3>
            <div className="space-y-2">
              {selectedPokemon.tricks.map((trick, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    trick.includes("if opponent")
                      ? "bg-blue-900 bg-opacity-50 border-l-4 border-blue-400"
                      : "bg-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {trick.includes("if opponent") && (
                      <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-sm leading-relaxed">{trick}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits and Light Mode Toggle */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Credits</span>
            <ChevronDown className="w-4 h-4 text-blue-400" />
          </div>
          <button onClick={() => setLightMode(!lightMode)} className="text-gray-400 hover:text-white transition-colors">
            {lightMode ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>
    </div>
  )
}
