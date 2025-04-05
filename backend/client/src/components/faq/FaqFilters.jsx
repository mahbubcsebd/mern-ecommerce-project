import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Filter, Search, X } from 'lucide-react';

const FaqFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  handleClearFilters,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by ID, question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter selects */}
        <div className="flex gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="payments">Payments</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="returns">Returns</SelectItem>
              <SelectItem value="account">Account</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory !== 'all' ||
        selectedStatus !== 'all' ||
        searchQuery) && (
        <div className="flex flex-wrap gap-2 items-center">
          {selectedCategory !== 'all' && (
            <Badge
              variant="outline"
              className="py-1"
            >
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 rounded-full hover:bg-gray-100 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge
              variant="outline"
              className="py-1"
            >
              Status: {selectedStatus}
              <button
                onClick={() => setSelectedStatus('all')}
                className="ml-2 rounded-full hover:bg-gray-100 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge
              variant="outline"
              className="py-1"
            >
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 rounded-full hover:bg-gray-100 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FaqFilters;
