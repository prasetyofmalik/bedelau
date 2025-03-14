import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import SKPTable from "./SKPTable";
import SKPForm from "./SKPForm";

const SKPSection: React.FC = () => {
  const [isAddingData, setIsAddingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAddClick = () => {
    setIsAddingData(true);
    setIsEditing(false);
    setEditData(null);
  };

  const handleEditClick = (data: any) => {
    setIsEditing(true);
    setIsAddingData(true);
    setEditData(data);
  };

  const handleCancelClick = () => {
    setIsAddingData(false);
    setIsEditing(false);
    setEditData(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Data SKP</h2>
        {!isAddingData && (
          <Button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tambah Data
          </Button>
        )}
      </div>

      {isAddingData ? (
        <div className="mb-6">
          <SKPForm
            onCancel={handleCancelClick}
            isEditing={isEditing}
            editData={editData}
          />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="week">Minggu Ini</TabsTrigger>
            <TabsTrigger value="month">Bulan Ini</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SKPTable onEditClick={handleEditClick} filter="all" />
          </TabsContent>
          <TabsContent value="today">
            <SKPTable onEditClick={handleEditClick} filter="today" />
          </TabsContent>
          <TabsContent value="week">
            <SKPTable onEditClick={handleEditClick} filter="week" />
          </TabsContent>
          <TabsContent value="month">
            <SKPTable onEditClick={handleEditClick} filter="month" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SKPSection;
