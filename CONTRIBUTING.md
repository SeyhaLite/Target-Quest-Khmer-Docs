# ការចូលរួម (Contributing)

អរគុណដែលចង់ចូលរួម! ឯកសារនេះណែនាំរបៀបកែសម្រួលឯកសារខ្មែរ
របៀបដាក់ពង្រាយលើ Read the Docs និងរបៀបធ្វើសមកាលកម្ម (sync) ជាមួយគម្រោងដើម។

## ការរៀបចំបរិយាកាសឯកសារ

```bash
# ១. clone repository
git clone https://github.com/SeyhaLite/Target-Quest-Khmer-Docs.git
cd Target-Quest-Khmer-Docs

# ២. ដំឡើងឧបករណ៍ (Python 3.8+ ត្រូវការ)
pip install -r docs/requirements.txt

# ៣. ដំណើរការម៉ាស៊ីនមើលឯកសារ (auto-reload)
mkdocs serve
# → បើក http://127.0.0.1:8000

# ៤. ពិនិត្យមុន commit — build ជាមួយ strict mode (បរាជ័យបើមាន warning)
mkdocs build --strict
```

## ក្បួនសម្រាប់ការសរសេរឯកសារខ្មែរ

1. **ភាសា៖** សរសេរជាខ្មែរធម្មជាតិ — កុំបកប្រែពាក្យមួយម្តងៗពីអង់គ្លេស។
   ដាក់ពាក្យបច្ចេកទេសអង់គ្លេសក្នុងវង់ក្រចកពេលប្រើលើកដំបូង
   (ឧ. "វ៉ិចទ័រល្បឿន (velocity)")។
2. **ពាក្យបច្ចេកទេស៖** ប្រើពាក្យស្របគ្នាតាម [docs/glossary.md](docs/glossary.md)។
   បើត្រូវការពាក្យថ្មី បន្ថែមវាក្នុង glossary ជាមួយនឹងហេតុផល។
3. **កូដ៖** កុំបកប្រែឈ្មោះអនុគមន៍/អថេរ/ឯកសារ (`take_damage`, `main.gd`...)។
   comment ក្នុង code block អាចជាខ្មែរបាន។
4. **ភាពត្រឹមត្រូវ៖** រាល់ការអះអាងអំពីឥរិយាបថកូដ ត្រូវយោងឯកសារ/បន្ទាត់ជាក់លាក់
   (ឧ. "`main.gd` បន្ទាត់ ១១៥")។ កុំសរសេរអ្វីដែលមិនបានផ្ទៀងផ្ទាត់ពីកូដ —
   បើមិនច្បាស់ សូមដាក់សម្គាល់ "មិនទាន់ផ្ទៀងផ្ទាត់"។
5. **រូបភាព/ដ្យាក្រាម៖** ប្រើ Mermaid (ងាយថែទាំ)។ រូបភាពថ្មីត្រូវមាន
   license ច្បាស់លាស់ និងកត់ត្រាក្នុង asset index របស់
   [docs/research/repository-audit.md](docs/research/repository-audit.md)។
6. **Link៖** ប្រើ relative link ក្នុង docs (ឧ. `[glossary](../glossary.md)`)។
   `mkdocs build --strict` នឹងចាប់យក link ខូចក្នុង nav។

## លំហូរការងារ (Workflow)

```bash
# ធ្វើការលើ branch ថ្មីជានិច្ច
git checkout -b docs/fix-glossary-terms

# commit តូចៗ ជាមួយសារ conventional
git add docs/glossary.md
git commit -m "docs: clarify Khmer term for velocity"

# push ហើយបើក Pull Request ទៅ main
git push -u origin docs/fix-glossary-terms
```

សារ commit ណែនាំ៖ `docs: ...` (មាតិកា), `build: ...` (mkdocs/RTD config),
`fix: ...` (កំហុស)។

## ការដាក់ពង្រាយលើ Read the Docs (ជំហានដោយដៃ)

Repository នេះមាន `.readthedocs.yaml` រួចរាល់ហើយ។ អ្វីដែលនៅសល់គឺ
ការ import គម្រោងលើគណនី Read the Docs របស់អ្នក៖

1. **ចូល/ចុះឈ្មោះ** នៅ <https://readthedocs.org/> ដោយប្រើគណនី **GitHub**
   (ដើម្បីឱ្យ RTD អាចមើលឃើញ repo របស់អ្នក)
2. ទៅ dashboard: <https://app.readthedocs.org/>
3. ចុច **"Import a Project"** (ឬ + Import)
4. ក្នុងបញ្ជី repo រក **`SeyhaLite/Target-Quest-Khmer-Docs`**
   - បើមិនឃើញ → ពិនិត្យថាបានអនុញ្ញាតឱ្យ Read the Docs ចូលគណនី GitHub របស់អ្នក
     (តាមការណែនាំលើអេក្រង់ ឬ Settings → Applications → Read the Docs)
5. ចុច **"+"** ដើម្បី import។ RTD នឹងប្រើ៖
   - Branch: `main` (default)
   - Config: `.readthedocs.yaml` (ubuntu-24.04, Python 3.12, MkDocs)
   - ឯកសារ config: `mkdocs.yml`
6. ការ build ចាប់ផ្តើមដោយស្វ័យប្រវត្តិ — ចុច **"Builds"** ដើម្បីមើល log។
   Build ជោគជ័យត្រូវចំណាយ ~១–៣ នាទី។
7. ពេល build ជាប់ (ពណ៌បៃតង) ចុច **"View docs"** — គេហទំព័រនឹងនៅ
   `https://<slug>.readthedocs.io/` (slug លំនាំដើមទំនងជា
   `target-quest-khmer-docs` ប៉ុន្តែពិនិត្យជាក់ស្តែងក្នុង dashboard)
8. **ក្រោយផ្ទៀងផ្ទាត់ URL ជោគជ័យ៖** បើ slug ខុសពី fallback ក្នុង `mkdocs.yml`
   សូមកែ `site_url` ឬទុកវាដោយសារ RTD ជំនួសដោយ `READTHEDOCS_CANONICAL_URL`
   ពេល build លើ RTD ស្រាប់។ បន្ទាប់មកអាប់ដេត README.md ជាមួយ URL ពិត។

!!! note "ការ build ឡើងវិញស្វ័យប្រវត្តិ"
    តាមលំនាំដើម RTD build ឡើងវិញរាល់ push ទៅ `main`។
    បើ build បរាជ័យ សូមអាន log ក្នុងផ្ទាំង Builds — កំហុសទូទៅ៖
    dependency version (ពិនិត្យ `docs/requirements.txt`) ឬ YAML syntax។

ប្រភពផ្លូវការ៖
[Add a project](https://docs.readthedocs.com/platform/stable/intro/add-project.html) ·
[MkDocs on RTD](https://docs.readthedocs.com/platform/stable/intro/mkdocs.html) ·
[Configuration file](https://docs.readthedocs.com/platform/stable/config-file/v2.html)

## ការធ្វើសមកាលកម្មជាមួយ upstream (Sync)

គម្រោងដើមអាចមានបច្ចុប្បន្នភាព។ របៀប sync ដោយសុវត្ថិភាព៖

```bash
# ១. បន្ថែម upstream ម្តង (បើមិនទាន់មាន)
git remote add upstream https://github.com/KernelVoltage/Target-Quest.git

# ២. ទាញយកបច្ចុប្បន្នភាព
git fetch upstream

# ៣. មើលអ្វីដែលផ្លាស់ប្តូរ
git log --oneline main..upstream/main          # commits ថ្មីរបស់ upstream
git diff --stat main upstream/main             # ឯកសារដែលប្រែប្រួល

# ៤. បញ្ចូលការផ្លាស់ប្តូរ (merge — កុំ rebase លើ history ដែល push រួច)
git checkout main
git merge upstream/main

# ៥. ដោះស្រាយ conflict (បើមាន) — ជាពិសេស README.md និង .gitignore
#    រក្សាផ្នែកឯកសារខ្មែររបស់យើង + ការផ្លាស់ប្តូរកូដរបស់ upstream

# ៦. ★ សំខាន់: ផ្ទៀងផ្ទាត់ឯកសារខ្មែរនៅតែត្រឹមត្រូវ
#    - បើ Script/*.gd ផ្លាស់ប្តូរ → ពិនិត្យលេខបន្ទាត់ និងការអះអាងក្នុង docs/
#    - ដំណើរការហ្គេមឡើងវិញក្នុង Godot
#    - mkdocs build --strict

# ៧. commit ការ sync ដោយសារពិពណ៌នាច្បាស់លាស់
git commit -m "chore: sync with upstream KernelVoltage/Target-Quest"
git push origin main
```

!!! warning "កុំបកប្រែដោយស្វ័យប្រវត្តិ"
    ពេល upstream ផ្លាស់ប្តូរកូដ កុំបកប្រែ/អាប់ដេតឯកសារខ្មែរដោយមិនបាន
    អានកូដថ្មីជាមុនសិន។ រាល់ការអាប់ដេតត្រូវផ្ទៀងផ្ទាត់ពីកូដពិត
    ហើយអាប់ដេត commit SHA យោងក្នុង `docs/research/repository-audit.md`។

## សុវត្ថិភាព

- **កុំ** commit token, password ឬ credential ណាមួយ។
- បើអ្នកឃើញ secret ត្រូវបាន commit ដោយចៃដន្យ៖ revoke/rotate វាភ្លាមៗ
  (ការលុបឯកសារចេញពី commit ថ្មី **មិន** ដកវាចេញពី Git history ទេ)។
- ប្រើ fine-grained personal access token ដែលមានសិទ្ធិអប្បបរមា
  (Contents: Read/Write សម្រាប់ repo នេះប៉ុណ្ណោះ)។
