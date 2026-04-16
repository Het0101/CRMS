package com.crms.core;

import com.crms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CrudControllers {

    @Autowired private CrimeTypeRepository crimeTypeRepo;
    @Autowired private CriminalRepository criminalRepo;
    @Autowired private OfficerRepository officerRepo;
    @Autowired private FirRepository firRepo;
    @Autowired private CaseRecordRepository caseRepo;
    @Autowired private EvidenceRepository evidenceRepo;
    @Autowired private CourtHearingRepository hearingRepo;

    // --- CRIMINAL CRUD ---
    @GetMapping("/criminals")
    public List<Criminal> getAllCriminals() { return criminalRepo.findAll(); }

    @GetMapping("/criminals/{id}")
    public Criminal getCriminal(@PathVariable Long id) { return criminalRepo.findById(id).orElse(null); }

    @PostMapping("/criminals")
    public Criminal createCriminal(@RequestBody Criminal entity) { return criminalRepo.save(entity); }

    @PutMapping("/criminals/{id}")
    public Criminal updateCriminal(@PathVariable Long id, @RequestBody Criminal entity) {
        entity.setCriminalId(id);
        return criminalRepo.save(entity);
    }

    // --- OFFICER CRUD ---
    @GetMapping("/officers")
    public List<Officer> getAllOfficers() { return officerRepo.findAll(); }

    @GetMapping("/officers/{id}")
    public Officer getOfficer(@PathVariable Long id) { return officerRepo.findById(id).orElse(null); }

    @PostMapping("/officers")
    public Officer createOfficer(@RequestBody Officer entity) { return officerRepo.save(entity); }

    @PutMapping("/officers/{id}")
    public Officer updateOfficer(@PathVariable Long id, @RequestBody Officer entity) {
        entity.setOfficerId(id);
        return officerRepo.save(entity);
    }

    // --- FIR CRUD ---
    @GetMapping("/firs")
    public List<Fir> getAllFirs() { return firRepo.findAll(); }

    @PostMapping("/firs")
    public Fir createFir(@RequestBody Fir entity) { return firRepo.save(entity); }

    // --- CASE RECORD CRUD ---
    @GetMapping("/cases")
    public List<CaseRecord> getAllCases() { return caseRepo.findAll(); }

    @PostMapping("/cases")
    public CaseRecord createCase(@RequestBody CaseRecord entity) { return caseRepo.save(entity); }

    // --- EVIDENCE CRUD ---
    @GetMapping("/evidence")
    public List<Evidence> getAllEvidence() { return evidenceRepo.findAll(); }

    @PostMapping("/evidence")
    public Evidence createEvidence(@RequestBody Evidence entity) { return evidenceRepo.save(entity); }

    // --- COURT HEARING CRUD ---
    @GetMapping("/hearings")
    public List<CourtHearing> getAllHearings() { return hearingRepo.findAll(); }

    @PostMapping("/hearings")
    public CourtHearing createHearing(@RequestBody CourtHearing entity) { return hearingRepo.save(entity); }
}