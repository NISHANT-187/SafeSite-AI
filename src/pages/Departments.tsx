import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import {
  Save,
  Plus,
  CheckSquare,
  Square,
  Sliders,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Departments: React.FC = () => {
  const { departments, updateDepartmentRules, addDepartment } = useApp();
  
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editedColor, setEditedColor] = useState('');
  const [editedPPE, setEditedPPE] = useState<string[]>([]);
  
  const [newDeptName, setNewDeptName] = useState('');
  const [newHelmetColor, setNewHelmetColor] = useState('Yellow');
  const [newRequiredPPE, setNewRequiredPPE] = useState<string[]>(['Helmet', 'Reflective Vest']);
  const [isAddingDept, setIsAddingDept] = useState(false);

  const availablePPE = [
    'Helmet',
    'Reflective Vest',
    'Safety Shoes',
    'Gloves',
    'Safety Goggles',
    'Face Shield',
    'Respirator',
    'Harness',
    'ID Card',
  ];

  const helmetColors = ['White', 'Yellow', 'Blue', 'Green', 'Red', 'Orange'];

  const handleStartEdit = (dept: typeof departments[0]) => {
    setEditingDeptId(dept.id);
    setEditedColor(dept.helmetColor);
    setEditedPPE(dept.requiredPPE);
  };

  const handleSaveEdit = (id: string) => {
    updateDepartmentRules(id, editedColor, editedPPE);
    setEditingDeptId(null);
  };

  const handleTogglePPE = (item: string, isEditing: boolean) => {
    if (isEditing) {
      setEditedPPE((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setNewRequiredPPE((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    addDepartment(newDeptName, newHelmetColor, newRequiredPPE);
    setNewDeptName('');
    setNewRequiredPPE(['Helmet', 'Reflective Vest']);
    setIsAddingDept(false);
  };

  return (
    <div className="space-y-5 select-none text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            PPE Rules & Trades
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5 font-medium">
            Configure mandatory safety gear requirements and helmet color mappings by worker trade role.
          </p>
        </div>
        <button
          onClick={() => setIsAddingDept(!isAddingDept)}
          className="px-4 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          CREATE TRADE GROUP
        </button>
      </div>

      {/* Adding Department form */}
      {isAddingDept && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="neumorph-card p-5 max-w-3xl overflow-hidden bg-white dark:bg-[#141B2D]"
        >
          <form onSubmit={handleCreateDept} className="space-y-4 text-xs font-semibold">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-2">New Trade Specification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                  Trade Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  placeholder="e.g. Electrician, Heavy Rigger"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                  Mandatory Helmet Color Mapped
                </label>
                <select
                  value={newHelmetColor}
                  onChange={(e) => setNewHelmetColor(e.target.value)}
                  className="w-full bg-[#FFFFFF] dark:bg-[#141B2D] border border-slate-350 dark:border-slate-800 rounded-lg px-2 py-2.5 text-xs text-slate-800 dark:text-slate-300 focus:outline-none"
                >
                  {helmetColors.map((color) => (
                    <option key={color} value={color}>{color.toUpperCase()} HELMET</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checklist items */}
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-0.5">
                Mandatory PPE Checklist Requirements
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-200/40 dark:bg-slate-950/20 p-4 rounded-lg border border-slate-300/40 dark:border-slate-850/60">
                {availablePPE.map((item) => {
                  const isChecked = newRequiredPPE.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleTogglePPE(item, false)}
                      className="flex items-center gap-2 text-left text-slate-700 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4.5 h-4.5 text-brand-primary" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-400" />
                      )}
                      <span className="uppercase text-[10px]">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingDept(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-550 hover:text-slate-700 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 cursor-pointer shadow-md"
              >
                CREATE RULE CARD
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid of rules card lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const isEditing = editingDeptId === dept.id;
          return (
            <GlassCard key={dept.id} className="flex flex-col justify-between p-5 min-h-[300px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-300/40 dark:border-slate-800/60 mb-3.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-primary" />
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Color check */}
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1.5">Helmet Color Mapped</span>
                    {isEditing ? (
                      <select
                        value={editedColor}
                        onChange={(e) => setEditedColor(e.target.value)}
                        className="w-full bg-[#FFFFFF] dark:bg-[#141B2D] border border-slate-300 dark:border-slate-850 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:outline-none"
                      >
                        {helmetColors.map((color) => (
                          <option key={color} value={color}>{color.toUpperCase()} HELMET</option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-850 bg-slate-200/50 dark:bg-slate-950/40 font-bold">
                        <span
                          className="w-2 h-2 rounded-full border border-white/20"
                          style={{
                            backgroundColor:
                              dept.helmetColor === 'White'
                                ? '#FFFFFF'
                                : dept.helmetColor === 'Yellow'
                                ? '#EAB308'
                                : dept.helmetColor === 'Blue'
                                ? '#2563EB'
                                : dept.helmetColor === 'Green'
                                ? '#22C55E'
                                : dept.helmetColor === 'Red'
                                ? '#EF4444'
                                : '#F97316',
                          }}
                        />
                        <span className="uppercase text-[10px]">{dept.helmetColor} HELMET</span>
                      </span>
                    )}
                  </div>

                  {/* Rules checkpoints */}
                  <div className="pt-3.5 border-t border-slate-300/40 dark:border-slate-800/60">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-2">Required Equipment Checklists</span>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 bg-slate-200/30 dark:bg-slate-950/20 p-2.5 rounded-lg border border-slate-300/40 dark:border-slate-850/60">
                        {availablePPE.map((item) => {
                          const isChecked = editedPPE.includes(item);
                          return (
                            <button
                              type="button"
                              key={item}
                              onClick={() => handleTogglePPE(item, true)}
                              className="flex items-center gap-2 text-left text-slate-700 dark:text-slate-350 cursor-pointer text-[10px] font-bold"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-brand-primary" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                              <span className="uppercase">{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {dept.requiredPPE.map((gear) => (
                          <span
                            key={gear}
                            className="bg-slate-200 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-850/80 text-slate-850 dark:text-slate-300 text-[9px] font-black uppercase px-2.5 py-0.5 rounded flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 text-brand-success" />
                            {gear}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 border-t border-slate-300/40 dark:border-slate-800/60 pt-3.5 mt-5 shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(dept.id)}
                      className="flex-1 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      SAVE RULES
                    </button>
                    <button
                      onClick={() => setEditingDeptId(null)}
                      className="px-4 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartEdit(dept)}
                    className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    MODIFY PPE REQUIREMENTS
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
