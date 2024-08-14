'use client'

import { Pill, PlusIcon } from '@/components/shared'
import { ProjectsTable } from '@/components/shared/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

enum Projects {
  'All Projects' = 'All Projects',
  'Pending Project' = 'Pending Project',
  'Completed Project' = 'Completed Project'
}

export default function Page () {
  return (
    <div className="app_dashboard_page app_dashboard_home">
      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(Projects).map(([label]) => (
              <Pill
                key={label}
                size='md'
                active={Projects['All Projects'] === label}
              >
                {label}
              </Pill>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search for project"
              className="app_navbar__right__searchbar"
            />

            <Button
              size="md"
              backgroundColor="shark-950"
              className="app_auth_login__btn"
            >
              <PlusIcon />
              Add project
            </Button>
          </div>
        </div>

        <ProjectsTable />
      </div>
    </div>
  )
}
