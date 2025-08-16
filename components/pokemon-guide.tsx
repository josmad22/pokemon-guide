"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import regionConfig from "@/data/config-region.json"
import { TrickItem } from "./TrickItem"

interface Pokemon {
  id?: string; // Optional
  name: string;
  image?: string; // Optional
  initialMove: string;
  tricks: Tricks[];
}

interface ConfigLeader {
  id: string;
  name: string;
  image?: string;
  pokemons?: Pokemon[];
}

interface Tricks{
  detail: string;
  variant: Tricks[];
}

interface Region extends ConfigLeader {
  image?: string;
  leaders: ConfigLeader[];
}

interface GuideLeader {
  id: string;
  pokemons: Pokemon[];
}

interface GuideData {
  leaders: GuideLeader[];
}

export default function PokemonGuide() {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [expandedLeader, setExpandedLeader] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [currentGuide, setCurrentGuide] = useState<GuideData | null>(null);
  const [lightMode, setLightMode] = useState(false);
  const [regions, setRegions] = useState<Region[]>(regionConfig.regions);

  // Predefined list of Pokémon files for each leader
  const pokemonDataMap: Record<string, Record<string, string[]>> = {
    kanto: {
      lorelei: ['articuno.json', 'bronzong.json', 'chansey.json', 'claydol.json'],
      bruno: [],
      agatha: [],
      lance: [],
      blue: []
    },
    johto: {
      will: [],
      koga: [],
      bruno: [],
      karen: [],
      lance: []
    },
    hoenn: {
      sidney: [],
      phoebe: [],
      glacia: [],
      drake: [],
      wallace: []
    },
    sinnoh: {
      aaron: [],
      bertha: [],
      flint: [],
      lucian: [],
      cynthia: []
    },
    unova: {
      shauntai: [],
      grimsley: [],
      caitlin: [],
      marshal: [],
      alder: []
    }
  };

  // Load pokemon data for leaders when the component mounts
  useEffect(() => {
    const loadPokemonData = async () => {
      const updatedRegions = [];
      
      for (const region of regionConfig.regions) {
        const updatedLeaders = [];
        
        for (const leader of region.leaders) {
          try {
            const pokemonFiles = pokemonDataMap[region.id]?.[leader.id] || [];
            const pokemons = [];
            
            // Import each file
            for (const file of pokemonFiles) {
              try {
                const module = await import(`@/data/${region.id}/${leader.id}/${file.replace('.json', '')}`);
                const data = module.default || module;
                pokemons.push({
                  ...data,
                  id: data.id || data.name?.toLowerCase() || file.replace('.json', ''),
                });
              } catch (error) {
                console.error(`Error importing ${file}:`, error);
              }
            }
            
            updatedLeaders.push({
              ...leader,
              pokemons,
            });
          } catch (error) {
            console.error(`Error loading pokemon data for ${leader.name}:`, error);
            updatedLeaders.push({
              ...leader,
              pokemons: [],
            });
          }
        }
        
        updatedRegions.push({
          ...region,
          leaders: updatedLeaders,
        });
      }

      setRegions(updatedRegions);
    };

    loadPokemonData();
  }, []);

  const handleRegionClick = async (regionId: string) => {
    if (expandedRegion === regionId) {
      setExpandedRegion(null);
      setExpandedLeader(null);
      setSelectedPokemon(null);
      setCurrentGuide(null);
    } else {
      setExpandedRegion(regionId);
      setExpandedLeader(null);
      setSelectedPokemon(null);
      try {
        const guide = await import(`@/data/guide-${regionId}.json`);
        setCurrentGuide(guide.default || guide);
      } catch (error) {
        console.error(`Could not load guide for ${regionId}:`, error);
        setCurrentGuide(null);
      }
    }
  };

  const handleLeaderClick = (leaderId: string) => {
    if (expandedLeader === leaderId) {
      setExpandedLeader(null);
      setSelectedPokemon(null);
    } else {
      setExpandedLeader(leaderId);
      setSelectedPokemon(null);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(selectedPokemon?.name === pokemon.name ? null : pokemon)
  }

  const currentRegion = regions.find((r) => r.id === expandedRegion);
  // Find the current leader from the regions data to get the pokemons
  const currentLeader = regions
    .find((r) => r.id === expandedRegion)
    ?.leaders.find((l) => l.id === expandedLeader);
  const currentLeaderPokemons = currentLeader?.pokemons || [];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        lightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Farm Liga PokeMMO</h1>
          <p className="text-gray-400 mb-4">Selecciona una región para ver los líderes</p>

          {/* Tips Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <ChevronDown className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Tips</span>
          </div>
        </div>

        {/* Regions Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {regions.map((region) => (
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

        {/* Leaders Row */}
        {expandedRegion && currentRegion && currentRegion.leaders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 animate-in slide-in-from-top duration-300">
            {currentRegion.leaders.map((leader) => (
              <div
                key={leader.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  expandedLeader === leader.id
                    ? "ring-2 ring-red-400 transform scale-105"
                    : "hover:transform hover:scale-102"
                }`}
                onClick={() => handleLeaderClick(leader.id)}
              >
                <img src={leader.image || "/placeholder.svg"} alt={leader.name} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{leader.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pokemon Grid */}
        {expandedLeader && currentGuide && (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentLeaderPokemons.map((pokemon) => (
                  <div
                    key={pokemon.id || pokemon.name}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                      selectedPokemon?.name === pokemon.name
                        ? "ring-2 ring-yellow-400 transform scale-105"
                        : "hover:transform hover:scale-105"
                    }`}
                    onClick={() => handlePokemonClick(pokemon)}
                  >
                    <img
                      src={pokemon.image || "/placeholder.svg"}
                      alt={pokemon.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                      <span className="text-white text-sm font-medium p-2 w-full text-center bg-black bg-opacity-60">
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
              <span>{selectedPokemon.initialMove}:</span>
            </h3>
            <div className="space-y-3">
              {selectedPokemon.tricks && selectedPokemon.tricks.length > 0 ? (
                selectedPokemon.tricks.map((trick, index) => (
                  <TrickItem key={index} trick={trick} />
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No hay estrategias disponibles para {selectedPokemon.name} aún.
                </div>
              )}
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
