
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setGenres, setPlatforms, setRating, setDates, setTags, setOrdering, resetFilters } from "@/store/slices/filtersSlice";
import { getPlatforms, getGenres, getTags } from "@/services/api";
import { motion } from "framer-motion";
import { Filter, Gamepad2, Calendar, Star, X, Tag as TagIcon, SortAsc } from "lucide-react";
import { toast } from "sonner";

// Simplified interfaces for local component use
interface SimplifiedItem {
  id: number;
  name: string;
  slug: string;
}

const yearRanges = [
  { id: "2023,2025", name: "Recent (2023-2025)" },
  { id: "2020,2022", name: "2020-2022" },
  { id: "2015,2019", name: "2015-2019" },
  { id: "2010,2014", name: "2010-2014" },
  { id: "2000,2009", name: "2000-2009" },
  { id: "1990,1999", name: "1990-1999" },
  { id: "1970,1989", name: "Retro (Pre-1990)" },
];

const sortOptions = [
  { id: "-added", name: "Recently Added" },
  { id: "-released", name: "Recently Released" },
  { id: "-metacritic", name: "Metacritic Rating" },
  { id: "-rating", name: "User Rating" },
  { id: "name", name: "Name (A-Z)" },
  { id: "-name", name: "Name (Z-A)" },
];

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filters);
  
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(filters.genres || []);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<number[]>(filters.platforms || []);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(filters.tags || []);
  const [selectedYearRange, setSelectedYearRange] = useState<string | undefined>(filters.dates);
  const [selectedRating, setSelectedRating] = useState<number>(filters.rating || 0);
  const [selectedOrdering, setSelectedOrdering] = useState<string>(filters.ordering || '-added');
  const [availableGenres, setAvailableGenres] = useState<SimplifiedItem[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<SimplifiedItem[]>([]);
  const [availableTags, setAvailableTags] = useState<SimplifiedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    platforms: true,
    tags: false,
    years: true,
    rating: true,
    ordering: true
  });

  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        // Fetch genres, platforms, and tags from API
        const [genresResponse, platformsResponse, tagsResponse] = await Promise.all([
          getGenres(),
          getPlatforms(),
          getTags()
        ]);
        
        // Map genres to simplified format
        const genres = genresResponse.results.map(genre => ({
          id: genre.id,
          name: genre.name,
          slug: genre.slug
        }));
        
        // Map platforms to simplified format (parent platforms)
        const platforms = platformsResponse.results.map(parentPlatform => ({
          id: parentPlatform.platform.id,
          name: parentPlatform.platform.name,
          slug: parentPlatform.platform.slug
        }));
        
        // Map tags to simplified format
        const tags = tagsResponse.results
          .filter(tag => tag.language === "eng") // Only English tags
          .map(tag => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug
          }));
        
        setAvailableGenres(genres);
        setAvailablePlatforms(platforms);
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
        toast.error("Failed to load filter options");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilterData();
  }, []);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle genre selection - now applies immediately
  const handleGenreChange = (genreId: number) => {
    const alreadySelected = selectedGenreIds.includes(genreId);
    
    // Update local state
    const newGenres = alreadySelected 
      ? selectedGenreIds.filter(id => id !== genreId)
      : [...selectedGenreIds, genreId];
      
    setSelectedGenreIds(newGenres);
    
    // Apply filter immediately
    dispatch(setGenres(newGenres));
    if (!alreadySelected) {
      toast.info("Filtering by genre", { duration: 1500 });
    }
  };

  // Handle platform selection - now applies immediately
  const handlePlatformChange = (platformId: number) => {
    const alreadySelected = selectedPlatformIds.includes(platformId);
    
    // Update local state
    const newPlatforms = alreadySelected 
      ? selectedPlatformIds.filter(id => id !== platformId)
      : [...selectedPlatformIds, platformId];
    
    setSelectedPlatformIds(newPlatforms);
    
    // Apply filter immediately
    dispatch(setPlatforms(newPlatforms));
    if (!alreadySelected) {
      toast.info("Filtering by platform", { duration: 1500 });
    }
  };
  
  // Handle tag selection - now applies immediately
  const handleTagChange = (tagId: number) => {
    const alreadySelected = selectedTagIds.includes(tagId);
    
    // Update local state
    const newTags = alreadySelected 
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    setSelectedTagIds(newTags);
    
    // Apply filter immediately
    dispatch(setTags(newTags));
    if (!alreadySelected) {
      toast.info("Filtering by tag", { duration: 1500 });
    }
  };
  
  // Handle year range selection - now applies immediately
  const handleYearRangeChange = (rangeId: string) => {
    const newRange = selectedYearRange === rangeId ? undefined : rangeId;
    setSelectedYearRange(newRange);
    dispatch(setDates(newRange));
    if (newRange) {
      const yearRange = yearRanges.find(yr => yr.id === rangeId);
      toast.info(`Filtering by ${yearRange?.name || "year range"}`, { duration: 1500 });
    }
  };
  
  // Handle ordering selection - now applies immediately
  const handleOrderingChange = (orderingId: string) => {
    setSelectedOrdering(orderingId);
    dispatch(setOrdering(orderingId));
    const sortOption = sortOptions.find(opt => opt.id === orderingId);
    toast.info(`Sorting by ${sortOption?.name || "selected option"}`, { duration: 1500 });
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    dispatch(setRating(rating)); // Apply immediately
    if (rating > 0) {
      toast.info(`Filtering by ${rating}+ rating`, { duration: 1500 });
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedGenreIds([]);
    setSelectedPlatformIds([]);
    setSelectedTagIds([]);
    setSelectedYearRange(undefined);
    setSelectedRating(0);
    setSelectedOrdering('-added');
    
    dispatch(resetFilters());
    toast.success("Filters cleared");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };
  
  const accordionVariants = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0, overflow: "hidden" }
  };

  return (
    <motion.div 
      className="bg-white shadow-md rounded-lg p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h4 
        className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center text-gray-800"
        variants={itemVariants}
      >
        <Filter className="w-4 h-4 mr-2" />
        Filter Games
      </motion.h4>
      
      {isLoading ? (
        <div className="flex flex-col space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          {/* Sorting Options */}
          <motion.div className="mb-4" variants={itemVariants}>
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('ordering')}
            >
              <h5 className="text-sm font-medium flex items-center text-gray-700">
                <SortAsc className="w-4 h-4 mr-1" />
                Sort By
              </h5>
              <span className={`transition-transform ${expandedSections.ordering ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            <motion.div 
              className="overflow-hidden"
              variants={accordionVariants}
              animate={expandedSections.ordering ? "open" : "closed"}
              initial={false}
            >
              <div className="space-y-1 mt-2">
                {sortOptions.map(option => (
                  <motion.div 
                    key={option.id} 
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    <Form.Check
                      type="radio"
                      id={`ordering-${option.id}`}
                      name="ordering"
                      checked={selectedOrdering === option.id}
                      onChange={() => handleOrderingChange(option.id)}
                      label={option.name}
                      className="text-sm text-gray-700"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Genres Filter */}
          {/* <motion.div className="mb-4" variants={itemVariants}>
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('genres')}
            >
              <h5 className="text-sm font-medium flex items-center text-gray-700">
                <Gamepad2 className="w-4 h-4 mr-1" />
                Genres
              </h5>
              <span className={`transition-transform ${expandedSections.genres ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            <motion.div 
              className="overflow-hidden"
              variants={accordionVariants}
              animate={expandedSections.genres ? "open" : "closed"}
              initial={false}
            >
              <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                {availableGenres.map(genre => (
                  <motion.div 
                    key={genre.id} 
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`genre-${genre.id}`}
                      checked={selectedGenreIds.includes(genre.id)}
                      onChange={() => handleGenreChange(genre.id)}
                      label={genre.name}
                      className="text-sm text-gray-700"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div> */}
          
          {/* Platforms Filter */}
          {/* <motion.div className="mb-4" variants={itemVariants}>
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('platforms')}
            >
              <h5 className="text-sm font-medium flex items-center text-gray-700">
                <Gamepad2 className="w-4 h-4 mr-1" />
                Platforms
              </h5>
              <span className={`transition-transform ${expandedSections.platforms ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            <motion.div 
              className="overflow-hidden"
              variants={accordionVariants}
              animate={expandedSections.platforms ? "open" : "closed"}
              initial={false}
            >
              <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                {availablePlatforms.map(platform => (
                  <motion.div 
                    key={platform.id} 
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`platform-${platform.id}`}
                      checked={selectedPlatformIds.includes(platform.id)}
                      onChange={() => handlePlatformChange(platform.id)}
                      label={platform.name}
                      className="text-sm text-gray-700"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div> */}
          
          {/* Tags Filter */}
          {/* <motion.div className="mb-4" variants={itemVariants}>
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('tags')}
            >
              <h5 className="text-sm font-medium flex items-center text-gray-700">
                <TagIcon className="w-4 h-4 mr-1" />
                Tags
              </h5>
              <span className={`transition-transform ${expandedSections.tags ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            <motion.div 
              className="overflow-hidden"
              variants={accordionVariants}
              animate={expandedSections.tags ? "open" : "closed"}
              initial={false}
            >
              <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                {availableTags.slice(0, 30).map(tag => ( // Limit to prevent overwhelming UI
                  <motion.div 
                    key={tag.id} 
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      label={tag.name}
                      className="text-sm text-gray-700"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div> */}
          
          {/* Year Range Filter */}
          <motion.div className="mb-4" variants={itemVariants}>
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('years')}
            >
              <h5 className="text-sm font-medium flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-1" />
                Year Range
              </h5>
              <span className={`transition-transform ${expandedSections.years ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            <motion.div 
              className="overflow-hidden"
              variants={accordionVariants}
              animate={expandedSections.years ? "open" : "closed"}
              initial={false}
            >
              <div className="space-y-1">
                {yearRanges.map(range => (
                  <motion.div 
                    key={range.id} 
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    <Form.Check
                      type="radio"
                      id={`year-range-${range.id}`}
                      checked={selectedYearRange === range.id}
                      onChange={() => handleYearRangeChange(range.id)}
                      name="yearRange"
                      label={range.name}
                      className="text-sm text-gray-700"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Rating Filter */}
          <motion.div className="mb-4" variants={itemVariants}>
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('rating')}
            >
              <h5 className="text-sm font-medium flex items-center text-gray-700">
                <Star className="w-4 h-4 mr-1" />
                Minimum Rating
              </h5>
              <span className={`transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            <motion.div 
              className="overflow-hidden"
              variants={accordionVariants}
              animate={expandedSections.rating ? "open" : "closed"}
              initial={false}
            >
              <div className="px-2">
                <div className="flex justify-between mb-1">
                  {[0, 1, 2, 3, 4, 5].map(value => (
                    <span key={value} className="text-xs text-gray-500">{value}</span>
                  ))}
                </div>
                <Form.Range 
                  min={0}
                  max={5}
                  step={1}
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2 text-sm">
                  {selectedRating === 0 ? 'Any rating' : `${selectedRating}+ stars`}
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Active Filters Summary */}
          <motion.div className="mb-4 p-2 bg-gray-50 rounded" variants={itemVariants}>
            <h5 className="text-sm font-medium mb-2 text-gray-700">Active Filters:</h5>
            <div className="flex flex-wrap gap-1">
              {selectedGenreIds.length > 0 && (
                <span className="text-xs bg-gaming-purple/20 text-gaming-purple px-2 py-1 rounded">
                  {selectedGenreIds.length} Genres
                </span>
              )}
              {selectedPlatformIds.length > 0 && (
                <span className="text-xs bg-gaming-purple/20 text-gaming-purple px-2 py-1 rounded">
                  {selectedPlatformIds.length} Platforms
                </span>
              )}
              {selectedTagIds.length > 0 && (
                <span className="text-xs bg-gaming-purple/20 text-gaming-purple px-2 py-1 rounded">
                  {selectedTagIds.length} Tags
                </span>
              )}
              {selectedYearRange && (
                <span className="text-xs bg-gaming-purple/20 text-gaming-purple px-2 py-1 rounded">
                  Year: {yearRanges.find(yr => yr.id === selectedYearRange)?.name}
                </span>
              )}
              {selectedRating > 0 && (
                <span className="text-xs bg-gaming-purple/20 text-gaming-purple px-2 py-1 rounded">
                  {selectedRating}+ Rating
                </span>
              )}
              {selectedOrdering !== '-added' && (
                <span className="text-xs bg-gaming-purple/20 text-gaming-purple px-2 py-1 rounded">
                  Sorted: {sortOptions.find(opt => opt.id === selectedOrdering)?.name}
                </span>
              )}
            </div>
          </motion.div>
          
          {/* Clear Filters Button */}
          <motion.div className="mt-4" variants={itemVariants}>
            <motion.button 
              className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-md transition-all flex items-center justify-center"
              onClick={clearFilters}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </motion.button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Sidebar;
