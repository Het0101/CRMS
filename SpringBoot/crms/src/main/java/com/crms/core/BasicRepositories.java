package com.crms.core;

import com.crms.entity.*;
import com.crms.entity.keys.*;
import org.springframework.data.jpa.repository.JpaRepository;

 interface CrimeTypeRepository extends JpaRepository<CrimeType, Long> {}
 interface CriminalRepository extends JpaRepository<Criminal, Long> {}
 interface OfficerRepository extends JpaRepository<Officer, Long> {}
 interface FirRepository extends JpaRepository<Fir, Long> {}
 interface CaseRecordRepository extends JpaRepository<CaseRecord, Long> {}
 interface FirCriminalRepository extends JpaRepository<FirCriminal, FirCriminalId> {}
 interface OfficerCaseRepository extends JpaRepository<OfficerCase, OfficerCaseId> {}
 interface EvidenceRepository extends JpaRepository<Evidence, Long> {}
 interface CourtHearingRepository extends JpaRepository<CourtHearing, Long> {}