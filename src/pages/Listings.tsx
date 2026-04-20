import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { DashInput, DashSelect } from '@/components/DashInput';
import { DashButton } from '@/components/DashButton';
import { Pencil, Trash2, Plus, Package, ExternalLink, Zap, Search, SlidersHorizontal, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Sold', label: 'Sold' },
];

const categoryOptions = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Other', label: 'Other' },
];

export default function ListingsPage() {
  const { listings, addListing, updateListing, deleteListing } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [status, setStatus] = useState('Active');

  const resetForm = () => { setName(''); setPrice(''); setCategory('Electronics'); setStatus('Active'); setEditId(null); setShowForm(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    if (editId) {
      updateListing(editId, { name, price: Number(price), category, status });
    } else {
      addListing({ name, price: Number(price), category, status });
    }
    resetForm();
  };

  const startEdit = (l: typeof listings[0]) => {
    setEditId(l.id); setName(l.name); setPrice(String(l.price)); setCategory(l.category); setStatus(l.status); setShowForm(true);
  };

  const filteredListings = listings.filter(l => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      l.name.toLowerCase().includes(searchLower) || 
      l.category.toLowerCase().includes(searchLower) || 
      l.status.toLowerCase().includes(searchLower);
    
    const matchesCategory = filterCategory === 'All' || l.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashLayout title="Product Listings">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl group w-full sm:w-80 focus-within:bg-white focus-within:border-black focus-within:shadow-lg focus-within:shadow-black/5 transition-all duration-300">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm font-medium placeholder:text-muted-foreground/60 w-full p-0 shadow-none ring-0" 
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DashButton 
              variant="secondary" 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-10 px-4 text-xs font-bold flex items-center gap-2 border-border whitespace-nowrap transition-all",
                showFilters && "bg-black text-white border-black hover:bg-slate-900"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {showFilters ? 'Hide Filters' : 'Filter'}
            </DashButton>
            <DashButton 
              onClick={() => { resetForm(); setShowForm(!showForm); }}
              className="h-10 px-5 bg-black text-white hover:bg-black/90 font-bold text-xs uppercase flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <Plus className={cn("h-4 w-4 transition-transform", showForm && "rotate-45")} />
              {showForm ? 'Close Form' : 'Add Listing'}
            </DashButton>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white border border-border p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex-1 min-w-[150px]">
              <DashSelect 
                label="Category" 
                options={[{value: 'All', label: 'All Categories'}, ...categoryOptions]} 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)} 
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <DashSelect 
                label="Status" 
                options={[{value: 'All', label: 'All Statuses'}, ...statusOptions]} 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
              />
            </div>
            {(filterCategory !== 'All' || filterStatus !== 'All' || search) && (
              <button 
                onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setSearch(''); }}
                className="text-xs font-bold text-muted-foreground hover:text-black mt-5 px-4 h-10 border border-dashed border-border rounded-xl hover:bg-secondary/30 transition-all"
              >
                Reset All
              </button>
            )}
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-border p-8 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-8">
               <Package className="h-5 w-5 text-accent-foreground" />
               <h3 className="font-bold text-sm">{editId ? 'Edit Product Details' : 'Create New Listing'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashInput label="Product Name" placeholder="e.g. Sony WH-1000XM5" value={name} onChange={e => setName(e.target.value)} className="h-10" />
                <DashInput label="Price ($)" type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} className="h-10" />
                <DashSelect label="Category" options={categoryOptions} value={category} onChange={e => setCategory(e.target.value)} />
                <DashSelect label="Status" options={statusOptions} value={status} onChange={e => setStatus(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <DashButton type="submit" className="h-10 px-8 bg-accent text-black hover:bg-black hover:text-white border-none font-bold text-xs uppercase shadow-sm">
                  {editId ? 'Save Changes' : 'Create Listing'}
                </DashButton>
                <DashButton variant="ghost" type="button" onClick={resetForm} className="h-10 px-6 font-bold text-xs uppercase text-muted-foreground hover:text-black">
                  Cancel
                </DashButton>
              </div>
            </form>
          </div>
        )}

        {filteredListings.length === 0 ? (
          <div className="py-24 bg-secondary/20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center text-center">
             <div className="h-16 w-16 rounded-full bg-white border border-border flex items-center justify-center mb-4 text-muted-foreground/30">
                <Package className="h-8 w-8" />
             </div>
             <h3 className="text-lg font-bold text-black mb-1">
               {listings.length === 0 ? 'No Listings Found' : 'No Matches Found'}
             </h3>
             <p className="text-sm text-muted-foreground max-w-xs font-medium">
               {listings.length === 0 
                ? 'Your inventory is currently empty. Start by adding your first product listing.'
                : 'No products match your current search and filter criteria.'}
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(l => (
              <div key={l.id} className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:border-accent transition-all group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px] font-bold uppercase tracking-wide">{l.category}</span>
                    <h4 className="font-bold text-black text-base line-clamp-1">{l.name}</h4>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border",
                    l.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 
                    l.status === 'Sold' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                    'bg-slate-50 text-slate-500 border-slate-200'
                  )}>
                    {l.status}
                  </span>
                </div>

                <div className="mt-auto space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Price</p>
                      <p className="text-2xl font-black font-heading text-black">${l.price}</p>
                    </div>
                    <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                      <Zap className="h-4 w-4 text-accent-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <DashButton 
                      variant="secondary"
                      onClick={() => startEdit(l)} 
                      className="h-8 pr-4 pl-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border-border"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </DashButton>
                    <DashButton 
                      variant="ghost"
                      onClick={() => deleteListing(l.id)} 
                      className="h-8 pr-4 pl-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </DashButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashLayout>
  );
}


