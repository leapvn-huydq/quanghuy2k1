# Huong dan trinh bay project khi phong van QA/QC (tieng Viet)

**Project:** Booking & Payment QA Automation Lab  
**Loai project:** Ca nhan, ung dung va du lieu gia lap, khong lien quan ma nguon khach hang.  
**Role:** Project owner / QA Engineer  
**Cong nghe:** JavaScript, Node.js, Playwright, REST API, HMAC SHA-256, GitHub Actions, Cursor, Claude Code va tai lieu MCP.

## Bai gioi thieu 60-90 giay

"Em co mot project ca nhan ve QA Automation cho luong booking va payment. Em tu xay dung mot ung dung gia lap, bao gom tim offer, tao booking, thanh toan gia lap, webhook/IPN, huy booking va hoan tien gia lap. Em bat dau bang viec xac dinh business rules, viet test plan va scenarios, sau do thiet ke test cases dua tren equivalence partitioning, boundary value va state transition. Phan automation co 55 bai test API/domain da chay pass, va 8 kich ban Playwright cho giao dien. Em co them GitHub Actions, test reports va rules/skills cho Cursor/Claude Code de chuan hoa cach viet test. Dung AI de tang toc soan test va code, nhung em tu review expected result va danh gia rui ro. Project nay dung du lieu fake, khong lay code hay data tu khach hang."

## Cau hoi & goi y tra loi

### 1. Vi sao em chon de tai booking/payment?

"Day la domain co nhieu quy tac quan trong: gia tien, so cho, status booking, thanh toan bat dong bo va callback trung. Em muon the hien ca ky nang phan tich nghiep vu, manual QC va automation, chu khong chi la test form login."

### 2. Em lam gi tu dau den cuoi?

"Em dinh nghia yeu cau gia lap va acceptance criteria; thiet ke test plan, scenario, test case, data, RTM; xay dung mock API va UI; viet test API/domain va Playwright; tao CI workflow, report va huong dan kiem thu. Em review lai code va expected result thay vi phu thuoc hoan toan vao AI."

### 3. Kien truc cua project nhu the nao?

"Browser goi REST API Node.js tren localhost. Domain layer xu ly validation, booking status, seat capacity va webhook thanh toan. In-memory Map luu du lieu gia lap. Test unit/domain chay khong qua HTTP, test API goi HTTP that va tao server moi cho moi test, Playwright thao tac tren giao dien."

### 4. Co nhung luong booking nao?

"Tao booking pending payment, thanh toan thanh cong -> confirmed, thanh toan that bai -> payment failed, cancel pending/failed -> cancelled, confirmed -> refunded gia lap. Em kiem tra luong hop le va cac transition khong hop le tra ve 409."

### 5. Em test payment va webhook the nao?

"Em xac minh HMAC signature tren raw body, doi chieu booking ID va amount, kiem tra event duplicate/idempotency, event ID bi dung lai voi noi dung khac, callback sai thu tu va truong hop payment fail. Tat ca chi gia lap, khong chuyen tien that."

### 6. Test case design techniques cua em?

"Em dung equivalence partitioning cho gia tri hop le/khong hop le; boundary value cho ten 0,1,60,61 ky tu va capacity 3 cho; decision table cho payment status/signature/amount; state transition cho PENDING_PAYMENT, CONFIRMED, FAILED, CANCELLED, REFUNDED."

### 7. Smoke vs regression trong project?

"Smoke tap trung health, offer contract, create booking va payment thanh cong de biet build co du kha nang tiep tuc test. Regression chay toan bo 55 API/domain cases, bao gom negative path, duplicate callback, invalid input va refund. Test UI la suite rieng."

### 8. Tinh huong bug quan trong nhat ma em chu dong cover?

"Em dat trong tam vao sai amount, callback khong co chu ky, callback duplicate, double settlement va giai phong seat hai lan. Day la rui ro nghiep vu co the anh huong tien va trang thai giao dich. Em test de chan sai lech truoc release."

### 9. Em dung Playwright ra sao?

"Em viet 8 script UI dua tren `data-testid`: load offer, required field, tao booking, thanh toan thanh cong/that bai, huy va hoan tien gia lap. Moi test dung mot local server/data moi. Co mot han che: moi truong kiem thu hien tai chan Chromium mo localhost, nen em chi xac nhan 55 API/domain pass; browser scripts can chay lai tren may/CI duoc cho phep."

### 10. Cursor, Claude Code, MCP, rules va skills dung de lam gi?

"Em dung Cursor/Claude Code nhu coding assistant de soan va refactor automation scripts, goi y edge cases va phan tich logs. Em viet rules/skills de quy dinh format TC, khong sua expected result theo bug, luon validate du lieu gia va can xac thuc ket qua. MCP la huong ket noi de AI dieu khien browser trong moi truong cho phep, nhung repo demo khong phu thuoc MCP de chay core tests."

### 11. AI co tu lam het hay em tu review?

"Em co su dung AI de tang toc do phat trien, nhung em chiu trach nhiem danh gia business rules, chon risk coverage, verify assertion, debug va chay test that. Khong xem output AI la bang chung pass."

### 12. Em viet report va sign-off the nao?

"Em tong hop so case da chay/pass/fail/blocked, phan loai loi, cung cap evidence va danh gia release risk. Trong demo em ghi ro 55/55 API pass va UI chua verify do environment restriction; khong danh dau pass cho test chua chay."

### 13. Tai sao khong public repo khach hang?

"Repo va website cua khach hang la tai san cong ty/khach hang. Em tu tao mock API va du lieu khac hoan toan de chung minh cach tu duy va ky nang ma khong tiet lo code, credentials hay nghiep vu noi bo."

### 14. Em co kinh nghiem lead team khong?

"Trong cong viec thuc te, em co kinh nghiem dieu phoi nhom QC 2 thanh vien, chia pham vi test, review test case/bug, xu ly blocker va tong hop tien do chat luong de trao doi voi Dev/PM/BA. Day la kinh nghiem tai cong ty, khong phai em co 2 member lam project ca nhan nay."

### 15. Neu co them thoi gian em se cai tien gi?

"Em se bo sung database persistence voi fixtures de cleanup, contract/schema validation, accessibility testing, race-condition tests cho sold-out, load testing va quan sat event audit. Day la roadmap chua implement, em khong ghi la da co."

## Cau tra loi sieu ngan cho HR

"Em lam QA/QC ca Manual va Automation. Em co kinh nghiem review yeu cau, viet scenario/test case, API/SQL, payment flows, smoke/regression, report va team coordination. Em dung Cursor/Claude/MCP de cai tien quy trinh va tu build mot project mock booking/payment voi 55 API tests da pass de chung minh nang luc automation."

## Nhung dieu khong nen noi

- Khong noi 'Em tu xay he thong dat ve/thu tien that'.
- Khong noi 'Tat ca 63 test deu pass' khi UI suite chua duoc verified.
- Khong noi 'Em owner ma nguon client'.
- Khong dua screenshot, credentials hay URL noi bo vao CV.
- Khong noi AI tu kiem thu da chay thanh cong neu chua co run evidence.