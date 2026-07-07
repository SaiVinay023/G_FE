'use client';

import { Box, Paper, Typography } from '@mui/material';
import { FC, useState, useCallback, useMemo } from 'react';
import React from 'react';

import { Table } from 'src/components/Table';
import { useCannedJobs } from 'src/hooks/pages/useCannedJobs';
import { CannedJob, CreateCannedJobRequest, UpdateCannedJobRequest } from 'src/store/slices/cannedJobsSlice';

import { useColumns } from './useColumns';
import { useRenderCollapsedRow } from './useRenderCollapsedRow';
import { Loader } from '../../Loader/index';
import { FilterBar } from './FilterBar';
import { AddCannedJobModal } from '../../modals/AddCannedJob/AddCannedJob';
import { UpdateCannedJobModal } from '../../modals/UpdateCannedJob/UpdateCannedJob';

export const CannedJobPage: FC = () => {
  const {
    cannedJobs,
    loading,
    filters,
    updateFilters,
    resetFilters,
    createCannedJob,
    updateCannedJob,
    deleteCannedJob,
  } = useCannedJobs();

  const renderCollapsedRow = useRenderCollapsedRow();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCannedJob, setSelectedCannedJob] = useState<CannedJob | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleOpenUpdateModal = useCallback(
    (id: string) => {
      // Find the job from the current list - this ensures we have the latest data
      const job = cannedJobs.find((job) => job.id === id);

      if (job) {
        setSelectedCannedJob(job);
        setIsUpdateModalOpen(true);
      }
    },
    [cannedJobs],
  );

  const handleCloseUpdateModal = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedCannedJob(null);
  }, []);

  const handleCreateCannedJob = useCallback(
    async (data: Omit<CreateCannedJobRequest, 'shopId'>) => {
      setIsCreating(true);
      try {
        await createCannedJob(data);
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('Failed to create canned job:', error);
      } finally {
        setIsCreating(false);
      }
    },
    [createCannedJob],
  );

  const handleDeleteCannedJob = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this canned job?')) {
        try {
          await deleteCannedJob(id);
        } catch (error) {
          console.error('Failed to delete canned job:', error);
        }
      }
    },
    [deleteCannedJob],
  );

  const handleCopyCannedJob = useCallback(
    (id: string) => {
      const job = cannedJobs.find((job) => job.id === id);
      if (job) {
        // Extract service data from the job and open add modal with pre-filled data
        const serviceGroups = job.estimateServiceGroups || job.services || job.serviceGroups || [];
        const firstGroup = serviceGroups[0];

        if (firstGroup) {
          console.log('Copy functionality to be implemented');
          setIsAddModalOpen(true);
        }
      }
    },
    [cannedJobs],
  );

  const columns = useColumns({
    onEdit: handleOpenUpdateModal,
    onDelete: handleDeleteCannedJob,
    onCopy: handleCopyCannedJob,
  });

  return (
    <>
      <FilterBar
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
        onAddCannedJob={handleOpenAddModal}
      />

      <Box
        component={Paper}
        variant="outlined"
        flexGrow={1}
        position="relative"
        sx={{
          borderRadius: '15px',
        }}
      >
        <Loader
          sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
          loading={loading}
          render={() =>
            cannedJobs?.length > 0 ? (
              <Table
                disableHeader
                data={cannedJobs}
                columns={columns}
                renderCollapsedRow={renderCollapsedRow}
                headerBackground="white"
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
                <Typography variant="h5" color="textSecondary">
                  No data found
                </Typography>
              </Box>
            )
          }
        />
      </Box>

      <AddCannedJobModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleCreateCannedJob}
        loading={isCreating}
      />

      <UpdateCannedJobModal open={isUpdateModalOpen} onClose={handleCloseUpdateModal} cannedJob={selectedCannedJob} />
    </>
  );
};
