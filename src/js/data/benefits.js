// 2026-11-04 기준 실제 공고를 조사해 원문으로 대조한 시범 데이터.
// 조사 원본과 확인 못 한 항목: docs/data/혜택_조사원본_2026-11-04.json
// support는 지원 형태(현금·교육·포인트·저축·물품 서비스), category는 분야다.
// eligibility.other는 사람이 직접 확인해야 판정이 끝나는 조건, cautions는 자격과 별개로 알아둘 점이다.
export const BENEFITS = [
  {
    "id": "yongin-exam-fee",
    "source": "city",
    "sourceName": "용인시",
    "category": "study",
    "support": "cash",
    "title": "자격·어학시험 응시료 지원",
    "officialTitle": "미취업청년 자격·어학시험 응시료 지원사업(경기청년 역량강화 기회지원 사업)",
    "oneLine": "토익·자격증 시험비를 돌려받아요",
    "amount": {
      "type": "money",
      "text": "최대 30만 원",
      "maxWon": 300000,
      "note": "낸 응시료만큼"
    },
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2008,
      "regions": [
        "경기도 용인시"
      ],
      "other": [
        "신청일에 주민등록이 용인시에 있어야 합니다.",
        "시험 본 날 직장 건강보험 가입자면 안 됩니다. 신청할 때는 취업했어도 괜찮습니다.",
        "근로계약이 1년 미만인 단기 근로자는 미취업자로 봅니다. 근로계약서 같은 증빙이 필요할 수 있습니다.",
        "2025년 12월 1일~2026년 11월 30일에 본인이 실제로 본 시험만 인정됩니다.",
        "지원 시험은 1,005종입니다(어학 19종, 한국사, 국가기술자격 541종, 국가전문자격 345종, 국가공인 민간자격 99종). 운전면허는 1종 특수만 됩니다.",
        "교육만 들으면 따는 자격, 수강료, 교재비, 자격증 발급비는 지원되지 않습니다. 무료 응시권으로 본 시험도 제외됩니다.",
        "같은 자격증 시험은 1년에 3번까지 지원됩니다.",
        "국민취업지원제도, 경기여성취업지원금 같은 비슷한 사업에 참여하는 기간에 본 시험은 신청할 수 없습니다.",
        "청년 국가기술자격 시험 응시료 지원을 받았다면 본인이 낸 금액만 지원됩니다.",
        "다른 기관에서 같은 지원을 받으면 안 되고, 나중에 확인되면 돈을 돌려줘야 합니다.",
        "외국인은 신청할 수 없습니다."
      ]
    },
    "ageText": "18~39세(1986년생~2008년생)",
    "period": {
      "start": "2026-09-01",
      "end": "2026-11-30"
    },
    "status": "closed",
    "closedReason": "budget",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "신청서(온라인 입력)"
      },
      {
        "name": "결제영수증(결제내역, 현금영수증, 이체확인증, 납부확인서 등)",
        "issuer": "은행·카드사 또는 시험 시행처"
      },
      {
        "name": "주민등록초본(신청일 당일 발급, 마이데이터 동의 시 생략)",
        "issuer": "정부24 또는 행정복지센터"
      },
      {
        "name": "건강보험 자격득실확인서(응시일 이후 발급, 마이데이터 동의 시 생략)",
        "issuer": "국민건강보험공단 또는 정부24"
      },
      {
        "name": "본인 명의 통장사본 또는 계좌개설확인서(계좌 인증 동의 시 생략)",
        "issuer": "해당 은행"
      },
      {
        "name": "유의사항 확인서(온라인 입력)"
      },
      {
        "name": "개인정보 수집·이용·제공 동의서(온라인 입력)"
      },
      {
        "name": "응시확인서 또는 성적표(이름, 시험명, 응시일, 시행기관이 보여야 함)",
        "issuer": "시험 시행처"
      },
      {
        "name": "해당자만: 1년 미만 단기 근로자는 근로계약서 등"
      },
      {
        "name": "해당자만: 건강보험 임의계속가입자는 4대보험가입내역확인서 등",
        "issuer": "4대사회보험 정보연계센터 또는 국민연금공단 지사"
      }
    ],
    "keywords": [
      "토익",
      "토플",
      "오픽",
      "JLPT",
      "자격증",
      "어학시험",
      "응시료",
      "시험비",
      "한국사",
      "취준"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026042800000000000063001",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "yongin-youth-rent",
    "source": "national",
    "sourceName": "국토교통부",
    "category": "housing",
    "support": "cash",
    "title": "청년 월세 지원",
    "officialTitle": "청년월세 지원",
    "oneLine": "월세를 매달 최대 20만 원 지원해요",
    "amount": {
      "type": "money",
      "text": "월 최대 20만 원",
      "maxWon": 4800000,
      "note": "최대 24개월, 평생 1번"
    },
    "eligibility": {
      "birthYearMin": 1991,
      "birthYearMax": 2007,
      "incomeMaxPercent": 100,
      "other": [
        "부모와 따로 사는 무주택 청년이어야 합니다.",
        "원래 가구 소득이 기준중위소득 100% 이하, 재산 4억 7천만 원 이하여야 합니다.",
        "청년 본인(청년 가구) 소득은 기준중위소득 60% 이하, 재산 1억 2천2백만 원 이하여야 합니다.",
        "실제 낸 월세만큼 받으며 보증금과 관리비는 지원되지 않습니다.",
        "주택을 가졌거나 2촌 이내 친척 집을 빌렸거나 공공임대주택에 살면 제외됩니다.",
        "1차 사업 수혜자는 남은 횟수만 받고, 2차 사업 수혜자는 사업이 끝난 뒤 신청할 수 있습니다.",
        "30세 미만 미혼이면 따로 사는 부모도 가구원으로 넣어 계산합니다.",
        "재산·가구 소득은 직접 판정할 수 없어 복지로 확인이 필요합니다."
      ]
    },
    "ageText": "19~34세",
    "period": {
      "start": "2026-03-30",
      "end": "2026-05-29"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "both"
    },
    "documents": [],
    "keywords": [
      "월세",
      "자취",
      "주거비",
      "집세",
      "원룸",
      "독립",
      "복지로"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026032300000000000061001&cp=2&pageSize=12&urlChk=list",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "yongin-interview-suit",
    "source": "city",
    "sourceName": "용인시",
    "category": "job",
    "support": "service",
    "title": "면접 정장 무료 대여(희망옷장)",
    "officialTitle": "용인청년 희망옷장(면접정장 무료대여)",
    "oneLine": "면접 볼 때 정장을 무료로 빌려요",
    "amount": {
      "type": "free",
      "text": "정장 무료 대여",
      "note": "연 3회, 4박 5일"
    },
    "eligibility": {
      "regions": [
        "경기도 용인시"
      ],
      "statuses": [
        "jobseeker"
      ],
      "other": [
        "용인시에 주민등록을 둔 내국인 구직 청년만 신청할 수 있습니다. 나이와 주소는 신청일 기준입니다.",
        "실제 취업 면접만 해당됩니다. 모의면접, 대학·대학원 면접, 교육과정 면접은 제외됩니다.",
        "면접일을 포함해 7일 전부터 신청할 수 있습니다.",
        "대여일로부터 1개월 안이면 사후 신청이 됩니다. 계약 대여업체에서 빌렸어야 하고, 주민등록 등·초본, 면접 증빙, 업체의 유료 대여 확인증이 필요합니다.",
        "대여 기간을 넘기거나 옷을 손상·분실하면 본인이 부담합니다."
      ],
      "birthYearMin": 1986,
      "birthYearMax": 2008
    },
    "ageText": "18~39세",
    "period": {
      "start": "2026-09-01",
      "end": "2026-09-17"
    },
    "status": "closed",
    "closedReason": "budget",
    "nextExpected": "2027년(날짜 미정)",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "최근 1개월 이내 발급 주민등록 초본 또는 등본"
      },
      {
        "name": "면접 사실 확인 캡처(회사명, 면접일, 연락처가 보여야 함)"
      },
      {
        "name": "전화로 면접 통보를 받았다면 입사지원서나 서류접수 확인증 등 취업지원 사실 자료"
      }
    ],
    "keywords": [
      "면접",
      "정장",
      "취준",
      "구두",
      "옷 대여"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026010200300200801946002",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "yongin-moving-cost",
    "source": "city",
    "sourceName": "용인시",
    "category": "housing",
    "support": "cash",
    "title": "이사비·부동산 수수료 지원",
    "officialTitle": "2026년 용인청년 중개보수 및 이사비 지원사업 추가 모집",
    "oneLine": "이사비와 복비를 합쳐 지원해요",
    "amount": {
      "type": "money",
      "text": "최대 40만 원",
      "maxWon": 400000,
      "note": "쓴 금액만큼, 평생 1번"
    },
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2007,
      "incomeMaxPercent": 180,
      "regions": [
        "경기도 용인시"
      ],
      "other": [
        "2026년 1월 1일~6월 30일에 용인으로 이사 왔거나 용인 안에서 이사하고 전입신고를 마쳐야 합니다.",
        "공고일에 계약서 주소에 살고 있어야 합니다.",
        "신청자 본인이 세대주이자 계약자여야 합니다. 부모·형제 명의 계약은 안 됩니다.",
        "무주택 청년이어야 하며, 분양권·입주권도 주택으로 봅니다.",
        "전·월세 보증금이 2억 원 이하여야 합니다. 월세나 반전세는 보증금에 '월세×12÷6.8%'를 더해 계산합니다.",
        "계약일 기준 민법상 성년이어야 합니다.",
        "소득은 가구원 합산 기준이고 건강보험료 납부액으로 심사합니다. 직접 판정할 수 없어 공고 표로 확인이 필요합니다.",
        "기초생활수급자, 부모·조부모 등 직계존속 소유 집을 빌린 경우, 외국인·재외국민은 제외됩니다.",
        "다른 기관의 이사비·중개수수료 지원과 중복으로 받을 수 없고, 본인·배우자·자녀 중복 신청도 안 됩니다.",
        "택배비, 청소비, 택시비, 대중교통비, 식사비는 지원되지 않습니다. 현금영수증이 안 되는 개인 간 거래와 간이영수증도 인정되지 않습니다.",
        "예산을 넘으면 자립준비청년·장애인·한부모가족을 먼저 뽑고 나머지는 점수로 정합니다."
      ]
    },
    "ageText": "19~39세(1986~2007년생)",
    "period": {
      "start": "2026-09-16",
      "end": "2026-09-22"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "지원신청서(온라인 입력)"
      },
      {
        "name": "서약서, 개인정보 수집·이용 동의서(본인)"
      },
      {
        "name": "해당자만: 개인정보 동의서(배우자, 자녀, 건강보험 부양자)"
      },
      {
        "name": "임대차 계약서 사본(임대 기간이 유효한 것)"
      },
      {
        "name": "중개보수·이사비 지출 증빙(이체확인증, 이사업체 사업자등록증 등)",
        "issuer": "홈택스"
      },
      {
        "name": "건강보험 납부확인서(납부하는 가구원 각 1부, 본인 것은 마이데이터 동의 시 생략)",
        "issuer": "국민건강보험공단"
      },
      {
        "name": "건강보험 자격확인서(가구원 각 1부, 본인 것은 마이데이터 동의 시 생략)",
        "issuer": "국민건강보험공단"
      },
      {
        "name": "가족관계증명서(일반, 본인·배우자 각 1부)",
        "issuer": "행정복지센터 또는 전자가족관계등록시스템"
      },
      {
        "name": "주민등록표 초본(주소 변동 포함, 행정정보 공동이용 동의 시 생략)"
      },
      {
        "name": "주민등록표 등본(마이데이터 동의 시 생략)"
      },
      {
        "name": "신청인 통장사본"
      },
      {
        "name": "해당자만: 보호종료아동 확인서",
        "issuer": "아동복지시설 또는 정부24"
      },
      {
        "name": "해당자만: 장애인증명서",
        "issuer": "행정복지센터 또는 정부24"
      },
      {
        "name": "해당자만: 한부모가족증명서",
        "issuer": "행정복지센터 또는 정부24"
      }
    ],
    "keywords": [
      "이사",
      "이사비",
      "복비",
      "중개수수료",
      "전입",
      "부동산"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026090700000000000077003",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "yongin-ai-job-coaching",
    "source": "city",
    "sourceName": "용인시",
    "category": "job",
    "support": "education",
    "title": "AI 자소서·면접 연습 지원",
    "officialTitle": "2026년 AI 활용 청년 취업역량강화 지원사업",
    "oneLine": "AI로 자소서 첨삭과 면접 연습을 해요",
    "amount": {
      "type": "none",
      "text": "AI 취업 도구 계정",
      "note": "자소서·면접·역량평가·NCS 교재. 이용료는 공고에 없어 확인 필요"
    },
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2008,
      "statuses": [
        "jobseeker",
        "student"
      ],
      "other": [
        "구직 중이에요",
        "용인시에 살거나 용인 지역 대학에 재학·휴학 중이에요",
        "올해 이 사업을 신청한 적이 없어요"
      ]
    },
    "ageText": "18~39세",
    "period": {
      "start": "2026-07-01",
      "end": "2026-11-30"
    },
    "status": "open",
    "apply": {
      "method": "online",
      "url": "https://youth.yongin.go.kr/web/main/youthApply/view?bizId=A2026030300300200801958001&cp=1&pageSize=8&dateChk=ing&urlChk=applyList"
    },
    "documents": [
      {
        "name": "주민등록등본·초본(신청일 기준 1개월 이내 발급) 또는 용인 소재 대학 재학·휴학증명서"
      }
    ],
    "keywords": [
      "자소서",
      "AI면접",
      "모의면접",
      "취업",
      "NCS",
      "인적성"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026030300300200801958001",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "구직 중인 청년이어야 합니다.",
      "용인시에 주민등록을 두고 살거나 용인 지역 대학에 재학·휴학 중이어야 합니다. 대학: 강남대, 경희대(국제), 단국대(죽전), 루터대, 명지대(자연), 용인대, 용인예술과학대, 칼빈대, 한국외대(글로벌).",
      "대학 자격으로 신청할 때 졸업증명서와 대학원 재학·휴학증명서는 인정되지 않습니다. 용인 주민은 주민등록 서류로 신청합니다.",
      "외국인은 제외됩니다.",
      "1인당 1년에 1번(계정 1개)만 신청할 수 있습니다.",
      "모집 인원은 300명이고 예산이 떨어지면 일찍 끝날 수 있습니다.",
      "이용료는 공고에 적혀 있지 않아 확인이 필요합니다.",
      "자소서, AI 취업멘토 같은 일부 기능은 이용량 제한이 있습니다."
    ]
  },
  {
    "id": "yongin-youth-deposit",
    "source": "city",
    "sourceName": "용인시",
    "category": "asset",
    "support": "savings",
    "title": "용인형 청년예금",
    "officialTitle": "용인형 청년예금",
    "oneLine": "만기 적금을 금리 더 얹어 예금해요",
    "amount": {
      "type": "none",
      "text": "금리 1%p 추가",
      "note": "최대 1천만 원, 12개월"
    },
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2008,
      "regions": [
        "경기도 용인시"
      ],
      "other": [
        "장병내일준비적금, 청년도약계좌, 청년내일저축계좌 중 하나를 만기까지 마쳤어요"
      ]
    },
    "ageText": "18~39세",
    "period": {
      "start": "2026-03-23",
      "end": "2028-02-29"
    },
    "status": "open",
    "apply": {
      "method": "visit"
    },
    "documents": [],
    "keywords": [
      "예금",
      "금리",
      "적금 만기",
      "청년도약계좌",
      "장병내일준비적금",
      "청년내일저축계좌",
      "목돈"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026031700300200801959001",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "장병내일준비적금, 청년도약계좌(특별중도해지자 포함), 청년내일저축계좌 중 하나를 만기까지 마친 사람이어야 합니다. 해지계좌 조회로 만기 해지가 확인되어야 합니다.",
      "국군희망준비적금은 해당되지 않습니다.",
      "청년도약계좌 특별중도해지자(청년미래적금 연계 가입자)는 7월 27일부터 가입할 수 있습니다.",
      "협약 농협·신협 지점에 본인이 직접 가서 가입해야 합니다.",
      "모집 인원은 1,250명이고 예산이 떨어지면 일찍 끝납니다."
    ]
  },
  {
    "id": "yongin-realtor-fee-discount",
    "source": "city",
    "sourceName": "용인시",
    "category": "housing",
    "support": "service",
    "title": "부동산 복비 할인",
    "officialTitle": "용인청년 부동산 중개보수 감면",
    "oneLine": "착한부동산에서 복비를 할인받아요",
    "amount": {
      "type": "none",
      "text": "복비 20% 이상 할인"
    },
    "eligibility": {
      "birthYearMin": 1991,
      "birthYearMax": 2008,
      "other": [
        "전·월세 보증금 1억 원 미만 계약이에요",
        "용인시 청년우대 착한부동산에서 계약해요",
        "사는 곳 요건을 용인시 청년정책과에 확인했어요"
      ]
    },
    "ageText": "18~34세(1991년생~2008년생)",
    "period": {
      "start": "2026-01-01",
      "end": "2026-12-31"
    },
    "status": "open",
    "apply": {
      "method": "visit",
      "url": "https://www.yongin.go.kr/home/www/www18/www18_06/www18_06_02/www18_06_02_06.jsp"
    },
    "documents": [],
    "keywords": [
      "복비",
      "중개수수료",
      "부동산",
      "전세",
      "월세",
      "착한부동산"
    ],
    "originalUrl": "https://youth.yongin.go.kr/web/main/youthPolicy/view?bizId=A2026021000000000000055001",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "용인시가 지정한 '청년우대 착한부동산'에서 계약해야 합니다. 쓸 수 있는 곳이 용인시 안 사무소로 한정됩니다.",
      "거주지 요건은 공고와 시청 안내 어디에도 적혀 있지 않아 용인시 청년정책과 확인이 필요합니다.",
      "전·월세 보증금 1억 원 미만 계약만 해당됩니다. 월세는 보증금에 월세×100을 더한 값으로 계산하며, 그 값이 5천만 원 미만이면 월세×70으로 계산합니다.",
      "할인 여부와 비율은 사무소마다 다를 수 있어 가기 전에 전화로 확인해야 합니다."
    ]
  },
  {
    "id": "yongin-solo-startup-office",
    "source": "city",
    "sourceName": "용인시산업진흥원",
    "category": "job",
    "support": "service",
    "title": "1인 창업 사무공간 무료 입주",
    "officialTitle": "2026년 1인 창조기업 지원센터 제4차 신규 입주기업 모집 공고(공고 제2026-169호)",
    "oneLine": "1인 창업자에게 사무실을 무료로 줘요",
    "amount": {
      "type": "free",
      "text": "사무공간 무료 입주",
      "note": "6개월, 최대 2년"
    },
    "eligibility": {
      "other": [
        "서류·발표 평가를 통과해 뽑힌 3개사만 입주할 수 있습니다.",
        "청년 전용이 아닙니다. 예비 창업자와 1인 창조기업이 대상입니다.",
        "다른 직장에 다니고 있지 않아야 합니다.",
        "다른 1인 창조기업 지원센터에 2년 입주한 적이 있으면 제외됩니다.",
        "공고 본문에 거주지나 사업장 위치 요건이 없습니다. 첨부 서류까지 확인하지는 못했습니다. 입주 공간은 용인시 기흥구 동백중앙로 245에 있습니다.",
        "쓰는 곳은 용인시예요. 사는 곳 요건은 확인하지 못했어요."
      ]
    },
    "period": {
      "start": "2026-10-08",
      "end": "2026-10-29"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "입주신청서(사업계획서, 대표자 이력서 포함)"
      },
      {
        "name": "주민등록등본(공동대표는 각 1부)"
      },
      {
        "name": "건강보험자격득실확인서"
      },
      {
        "name": "지방세·국세 납입증명서"
      },
      {
        "name": "서약서"
      },
      {
        "name": "K-Startup 정회원 확인서"
      }
    ],
    "keywords": [
      "창업",
      "1인 창업",
      "사무실",
      "공유오피스",
      "예비창업"
    ],
    "originalUrl": "https://www.venturesquare.net/announcement/1119049",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "gg-exam-fee",
    "source": "province",
    "sourceName": "경기도",
    "category": "study",
    "support": "cash",
    "title": "경기도 청년 시험 응시료 지원",
    "officialTitle": "2026년 경기청년 역량강화 기회지원 사업",
    "oneLine": "토익·자격증 응시료를 돌려줘요",
    "amount": {
      "type": "money",
      "text": "연 최대 30만 원",
      "maxWon": 300000,
      "note": "쓴 만큼 돌려받음"
    },
    "ageText": "기본 19~39세, 시군마다 다름. 구리 19~39세, 용인 18~39세",
    "eligibility": {
      "regions": [
        "경기도"
      ],
      "other": [
        "내 시군 예산이 아직 남아 있어요",
        "내 시군 나이 기준에 맞아요",
        "시험 본 날 미취업이었어요",
        "신청일에 해당 시군에 살아요"
      ],
      "excludedRegions": [
        "경기도 용인시",
        "경기도 구리시",
        "경기도 성남시"
      ]
    },
    "period": {
      "start": "2026-05-11",
      "end": "2026-12-04"
    },
    "status": "open",
    "apply": {
      "method": "online",
      "url": "https://apply.jobaba.net/special/GGtestfees/main.do",
      "loginRequired": true
    },
    "documents": [
      {
        "name": "온라인 신청서"
      },
      {
        "name": "결제 영수증"
      },
      {
        "name": "주민등록초본 (첨부 또는 마이데이터 동의)"
      },
      {
        "name": "건강보험 자격득실확인서 (첨부 또는 마이데이터 동의)"
      },
      {
        "name": "본인 통장 사본 또는 계좌개설확인서 (또는 계좌 인증 동의)"
      },
      {
        "name": "유의사항 확인서"
      },
      {
        "name": "개인정보 수집·이용·제공 동의서"
      },
      {
        "name": "응시확인서 또는 성적표"
      }
    ],
    "keywords": [
      "토익",
      "오픽",
      "토스",
      "자격증",
      "컴활",
      "한국사",
      "응시료",
      "시험비",
      "어학시험"
    ],
    "originalUrl": "https://apply.jobaba.net/special/GGtestfees/main.do",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "성남시는 자체 사업(올패스)을 따로 해서 빠지고, 나머지 30개 시군이 참여",
      "시군마다 예산이 따로 있고 다 쓰면 선착순으로 끝남. 내 시군이 아직 받는지 꼭 확인 필요",
      "용인시와 구리시는 예산 소진으로 이미 마감",
      "나이 기준은 주소지 시군 조례를 따라서 내 시군 확인 필요",
      "미취업 여부는 신청일이 아니라 시험 본 날 기준. 지금 취업했어도 시험 본 날 미취업이면 신청 가능 (용인 안내 기준)",
      "1년 미만 계약 단기 노동자는 미취업으로 봄 (용인 안내 기준)",
      "신청일에 해당 시군에 살고 있어야 함",
      "신청 횟수와 회당 금액 제한은 없지만 같은 시험은 연 3회까지",
      "응시 기간은 용인 기준 2025년 12월 1일~2026년 11월 30일. 구리는 2025년 12월 1일 이후로만 안내해서 내 시군 확인 필요",
      "교육만 받으면 시험 없이 따는 자격은 제외",
      "다른 사업으로 같은 응시료를 받았으면 중복 지원 불가 (용인시 안내 기준). 시군별 조건은 확인 필요"
    ]
  },
  {
    "id": "gg-basic-income",
    "source": "province",
    "sourceName": "경기도",
    "category": "living",
    "support": "cash",
    "title": "경기도 청년 기본소득",
    "officialTitle": "2026년 경기도 청년기본소득 4분기 모집",
    "oneLine": "만 24세에게 지역화폐를 줘요",
    "amount": {
      "type": "money",
      "text": "분기 25만 원",
      "maxWon": 1000000,
      "note": "연 최대 100만 원, 지역화폐"
    },
    "ageText": "만 24세 (2001.10.2.~2002.10.1. 출생)",
    "eligibility": {
      "birthYearMin": 2001,
      "birthYearMax": 2002,
      "regions": [
        "경기도"
      ],
      "other": [
        "경기도에 3년 이상 계속 살았거나 합산 10년 이상 살았어요",
        "생일이 2001.10.2~2002.10.1 사이예요"
      ],
      "excludedRegions": [
        "경기도 성남시",
        "경기도 고양시"
      ]
    },
    "period": {
      "start": "2026-11-02",
      "end": "2026-12-01"
    },
    "status": "open",
    "apply": {
      "method": "online",
      "url": "https://apply.jobaba.net/special/gibon/main.do",
      "loginRequired": true
    },
    "documents": [
      {
        "name": "주민등록초본 (공공 마이데이터 동의 시 자동 제출)"
      },
      {
        "name": "기초생활수급 증빙 서류 (일시금으로 받으려는 수급자만)"
      }
    ],
    "keywords": [
      "기본소득",
      "24살",
      "24세",
      "지역화폐",
      "25만원",
      "경기도 청년수당"
    ],
    "originalUrl": "https://youth.gg.go.kr/gg/intro/notice.do?mode=view&articleNo=10501&article.offset=0&articleLimit=10",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "경기도에 주민등록을 두고 최근 3년 이상 계속 살았거나, 합산 10년 이상 살아야 함",
      "거주 기준일은 도 공지와 용인청년포털은 신청일, 메트로신문은 10월 1일로 달라 확인 필요",
      "성남시·고양시 거주자는 제외",
      "외국인·거주불명자 제외 (보도 기준)",
      "취업·졸업 여부, 소득·재산은 보지 않음 (보도 기준)",
      "생일이 2001.10.2.~2002.10.1. 범위인지 정확히 확인 필요 (출생연도만으로는 판정 불가)",
      "지난 분기를 놓쳤어도 요건이 맞으면 함께 신청할 수 있음 (보도 기준). 공식 안내에서는 확인하지 못해 콜센터 확인 필요"
    ]
  },
  {
    "id": "gg-interview-allowance",
    "source": "province",
    "sourceName": "경기도",
    "category": "job",
    "support": "cash",
    "title": "경기도 청년 면접 수당",
    "officialTitle": "2026년 제1차 경기도 청년 면접수당 모집 공고",
    "oneLine": "면접 한 번에 5만 원을 줘요",
    "amount": {
      "type": "money",
      "text": "최대 15만 원",
      "maxWon": 150000,
      "note": "면접 1회 5만 원, 연 3회, 지역화폐"
    },
    "ageText": "18~39세 (1986.1.1.~2008.12.31. 출생). 병역 이행 기간만큼 최대 3년 연장, 42세까지",
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2008,
      "regions": [
        "경기도"
      ],
      "other": [
        "신청일에 경기도에 주민등록이 있는 대한민국 청년",
        "2026년 1월 1일 이후 본 면접만 해당 (2025년 12월 면접은 1차 모집에 한해 소급)",
        "재직 여부와 합격 여부는 보지 않음",
        "도외 기업, 해외 기업, 주 30시간 미만 일자리 면접도 인정",
        "전화·문자·메신저 면접, 교육·훈련 과정 면접, 가족이 대표인 사업장 면접은 제외",
        "경기도·도교육청·도의회 지방공무원 면접은 제외",
        "신청일에 실업급여를 받거나 경기여성취업지원금에 참여 중이면 신청 불가",
        "청년기본소득, 국민취업지원제도, 청년 복지포인트와는 함께 받을 수 있음",
        "병역 연장 대상자는 복무 기간 확인 필요",
        "지역화폐 앱 가입과 이용 등록을 마쳐야 받을 수 있음"
      ]
    },
    "period": {
      "start": "2026-06-24",
      "end": "2026-07-07"
    },
    "status": "closed",
    "closedReason": "budget",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "온라인 신청서와 개인정보 동의서"
      },
      {
        "name": "주민등록표 등본 또는 초본 (마이데이터 자동 제출 또는 파일 첨부)"
      },
      {
        "name": "채용공고문"
      },
      {
        "name": "면접확인서, 또는 대체서약서와 면접 증빙 서류"
      }
    ],
    "keywords": [
      "면접비",
      "면접수당",
      "취준",
      "면접",
      "5만원",
      "지역화폐"
    ],
    "originalUrl": "https://www.gg.go.kr/contents/contents.do?ciIdx=987029&menuId=265937",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "gg-ladder",
    "source": "province",
    "sourceName": "경기도미래세대재단",
    "category": "study",
    "support": "education",
    "title": "경기청년 사다리 해외 연수",
    "officialTitle": "2026년 경기청년 사다리 프로그램 사업 참여자 모집 공고",
    "oneLine": "해외 대학 연수비를 대 줘요",
    "amount": {
      "type": "free",
      "text": "해외 연수비 지원",
      "note": "연수비·항공료·보험료·숙식비. 여권·비자 비용은 본인 부담"
    },
    "ageText": "공고일(2026.3.3.) 기준 19~39세 (1986~2007년생)",
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2007,
      "regions": [
        "경기도"
      ],
      "other": [
        "공고일에 경기도에 주민등록이 있는 대한민국 국적자",
        "교육, 연수, 성과공유회, 사후관리 전 일정에 참여할 수 있어야 함",
        "경기청년 사다리나 시·군 사다리에 참여한 적이 있으면 제외 (중도 포기자 포함)",
        "파란사다리, 글로벌 현장학습, WEST 참여자 제외",
        "2026년 경기청년 갭이어 참여자 제외",
        "여권 발급 불가, 출국금지, 건강 사유로 연수가 어려우면 제외",
        "기초생활수급자, 차상위계층, 자립준비청년, 쉼터 퇴소 청년, 국가보훈대상자, 북한이탈주민, 장애청년은 우대 대상 (모집 인원의 70% 범위)",
        "전문대 졸업 이하, 해외 경험 없는 청년은 가점. 어학 능력은 선발 기준이 아님"
      ]
    },
    "period": {
      "start": "2026-03-06",
      "end": "2026-03-26"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "자기계발계획서 (온라인 작성)"
      },
      {
        "name": "주민등록초본"
      },
      {
        "name": "출입국에 관한 사실증명"
      },
      {
        "name": "가점 증빙 서류 (해당자)"
      }
    ],
    "keywords": [
      "해외연수",
      "어학연수",
      "유학",
      "미국",
      "캐나다",
      "호주"
    ],
    "originalUrl": "https://youth.gg.go.kr/gg/intro/ladder-notice.do?mode=view&articleNo=9041&article.offset=0&articleLimit=10",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "gg-youth-welfare-point",
    "source": "province",
    "sourceName": "경기도일자리재단",
    "category": "living",
    "support": "voucher",
    "title": "경기도 청년 복지포인트",
    "officialTitle": "2026년 경기도 청년 복지포인트 모집 정정공고",
    "oneLine": "재직 청년에게 복지 포인트를 줘요",
    "amount": {
      "type": "goods",
      "text": "연 120만 포인트",
      "maxWon": 1200000,
      "note": "2번 나눠 지급, 전용 복지몰에서 사용"
    },
    "ageText": "만 19~39세 (1986.1.1.~2007.12.31. 출생). 병역 이행 기간만큼 최대 3년 연장",
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2007,
      "regions": [
        "경기도"
      ],
      "statuses": [
        "employed"
      ],
      "other": [
        "경기도 내 중소·중견기업, 소상공인, 비영리법인에서 주 36시간 이상 근무",
        "2026년 1~6월 건강보험료 월평균 138,276원 이하 (월 과세 급여 약 385만 원). 4대보험 미가입자는 같은 기간 평균 급여 약 385만 원 이하",
        "국가·지자체, 공공기관, 학교법인, 사립학교 등 재직자 제외",
        "복지포인트에 참여한 적이 있으면 제외",
        "청년 노동자 통장, 청년연금, 중소기업 청년 노동자 지원사업에 참여 중이거나 2025년 7월~2026년 6월에 중도 해지했으면 제외. 정상 종료는 신청 가능",
        "2026년 1~6월 휴직 이력자, 군 복무 중인 사람 제외",
        "국가근로장학생, 해외 파견자 제외"
      ]
    },
    "period": {
      "start": "2026-07-01",
      "end": "2026-07-13"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [],
    "keywords": [
      "복지포인트",
      "직장인",
      "중소기업",
      "재직자",
      "복지몰",
      "120만원"
    ],
    "originalUrl": "https://youth.jobaba.net/youth/bbs/B0000025/view.do?pstSn=132798&menuSn=200014&pageIndex=1",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "gg-gap-year",
    "source": "province",
    "sourceName": "경기도미래세대재단",
    "category": "job",
    "support": "education",
    "title": "경기청년 갭이어",
    "officialTitle": "2026년 경기청년 갭이어 프로그램 참여자 모집 공고",
    "oneLine": "하고 싶은 프로젝트 비용을 지원해요",
    "amount": {
      "type": "money",
      "text": "최대 500만 원",
      "maxWon": 5000000,
      "note": "쓴 만큼 지원"
    },
    "ageText": "19~39세 (1986~2007년생). 병역 이행 기간만큼 연장, 최고 1983년생까지",
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2007,
      "regions": [
        "경기도"
      ],
      "other": [
        "공고일에 경기도에 주민등록이 있는 대한민국 국적자",
        "병역 이행자는 복무 기간 확인 필요",
        "개인 또는 팀으로 지원 가능. 팀은 인원별 최대 3,000만 원까지",
        "2023~2025년 갭이어 참여자는 제외 (면접 합격 후 포기자 포함). 2024~2025년 교육 뒤 중간평가에서 떨어진 사람은 재지원 가능",
        "2026년 경기청년 사다리 참여자 제외",
        "종교 전파, 특정 정당·후보 지지, 생명·신체 위험이 큰 프로젝트는 제외",
        "서류 1,200명, 면접 720명, 교육 뒤 최종심사로 600명 내외 선발",
        "기초생활수급자, 차상위계층, 자립준비청년, 장애인은 가점"
      ]
    },
    "period": {
      "start": "2026-03-18",
      "end": "2026-04-03"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "온라인 신청서"
      },
      {
        "name": "가점 증빙 서류 (해당자)"
      },
      {
        "name": "주민등록초본 (병역으로 나이 연장이 필요한 사람)"
      }
    ],
    "keywords": [
      "갭이어",
      "진로",
      "프로젝트",
      "취업 고민",
      "퇴사 후",
      "500만원"
    ],
    "originalUrl": "https://youth.gg.go.kr/gg/intro/notice.do?mode=view&articleNo=9063&article.offset=30&articleLimit=10",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "national-employment-support",
    "source": "national",
    "sourceName": "고용노동부",
    "category": "job",
    "support": "cash",
    "title": "국민취업지원제도",
    "officialTitle": "국민취업지원제도",
    "oneLine": "취업 상담과 함께 구직 활동비를 매달 지원해요",
    "amount": {
      "type": "money",
      "text": "월 60만 원",
      "maxWon": 3600000,
      "note": "6개월, 1유형 기준"
    },
    "ageText": "청년 만 15~34세 (병역 이행 기간을 더하면 최대 37세). 제도 전체는 만 15~69세",
    "eligibility": {
      "birthYearMin": 1989,
      "birthYearMax": 2011,
      "statuses": [
        "jobseeker"
      ],
      "other": [
        "만 34세 이하예요 (병역 기간만큼 최대 37세까지 늘어나요)",
        "유형별 소득·재산·취업 경험 조건을 고용24에서 확인했어요"
      ]
    },
    "period": {
      "always": true
    },
    "status": "open",
    "apply": {
      "method": "both",
      "url": "https://www.work24.go.kr/ua/z/z/1300/selectEmssRqutIntro.do",
      "loginRequired": true
    },
    "documents": [
      {
        "name": "취업지원 신청서"
      },
      {
        "name": "개인정보 수집·이용·제공 동의서"
      },
      {
        "name": "행정정보 공동이용 동의서"
      },
      {
        "name": "수급자격 조사 확인서"
      }
    ],
    "keywords": [
      "구직촉진수당",
      "취준생",
      "취업 지원금",
      "백수",
      "실업",
      "구직",
      "취업 상담",
      "월 60만원"
    ],
    "originalUrl": "https://www.work24.go.kr/ua/z/z/1300/selectEmssRqutIntro.do",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "소득 조건은 유형마다 달라요. 2유형 청년은 소득과 재산에 상관없이 참여할 수 있어서 소득 상한을 비워 뒀어요.",
      "1유형 요건심사형은 가구 소득 중위소득 60% 이하, 재산 5억 원 이하(청년 기준), 최근 2년 안에 100일 또는 800시간 이상 일한 경험이 필요해요.",
      "일한 경험이 모자란 청년은 가구 소득 중위소득 120% 이하, 재산 5억 원 이하면 선발형으로 신청할 수 있어요. 다만 예산 상황에 따라 1유형으로 뽑히지 않을 수 있어요.",
      "18세 이하·70세 이상·중증장애인 부양가족 1명당 월 10만 원이 더해져요(최대 40만 원).",
      "다시 참여할 때의 제한 기간은 고용24 안내에서 찾지 못해 확인 필요.",
      "1991년생은 신청일 기준 만 34세를 넘겼는지 확인 필요."
    ]
  },
  {
    "id": "national-learning-card",
    "source": "national",
    "sourceName": "고용노동부",
    "category": "study",
    "support": "education",
    "title": "국민내일배움카드",
    "officialTitle": "국민내일배움카드",
    "oneLine": "직업 훈련비를 5년간 나라가 카드로 지원해요",
    "amount": {
      "type": "money",
      "text": "5년간 300만 원",
      "maxWon": 5000000,
      "note": "일부는 최대 500만 원"
    },
    "ageText": "75세 이상 제외. 나이 하한은 안내에 없음",
    "eligibility": {
      "other": [
        "졸업까지 2년 넘게 남은 대학생이 아니에요",
        "공무원·사립학교 교직원이 아니에요",
        "일정 소득을 넘는 대규모 기업 근로자·자영업자가 아니에요"
      ]
    },
    "period": {
      "always": true
    },
    "status": "open",
    "apply": {
      "method": "both",
      "url": "https://www.work24.go.kr/hr/h/a/1100/selectIssuGudn.do",
      "cost": "copay",
      "loginRequired": true
    },
    "documents": [
      {
        "name": "신분증"
      },
      {
        "name": "내일배움카드 발급 신청서"
      },
      {
        "name": "개인정보 수집·이용 동의서"
      },
      {
        "name": "지원 대상 입증 서류 (해당자만)"
      }
    ],
    "keywords": [
      "내배카",
      "국비지원",
      "학원비",
      "자격증",
      "코딩 학원",
      "컴활",
      "직업훈련",
      "취업 준비",
      "훈련비"
    ],
    "originalUrl": "https://www.work24.go.kr/hr/h/a/1100/selectIssuGudn.do",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "졸업까지 2년 이상 남은 대학·대학원 재학생과 고등학교 1~2학년은 받을 수 없어요. 정부24는 졸업까지 2년을 넘게 남은 대학생, 졸업 예정이 아닌 고등학생으로 적어요.",
      "공무원, 사립학교 교직원은 받을 수 없어요.",
      "월 임금 300만 원 이상이면서 만 45세 미만인 대규모 기업 근로자는 제외돼요.",
      "사업 기간 1년 미만이거나 연 매출 4억 원 이상인 자영업자는 제외돼요.",
      "월 소득 500만 원 이상인 특수형태근로종사자는 제외돼요.",
      "사업 기간 1년 미만이거나 월 소득 300만 원 이상인 법인 대표, 월 소득 300만 원 이상인 비영리단체 대표는 제외돼요.",
      "생계급여 수급자는 제외돼요. 조건부 수급자와 조건부과 유예자는 받을 수 있어요.",
      "다른 기관에서 교육비를 받는 사람, 부정수급으로 제한된 사람은 제외돼요.",
      "실업자는 고용24에서 구직 신청을 먼저 해야 해요.",
      "200만 원 추가 지원은 기간제·파견·단시간·일용 근로자, 저소득층, 장애인 등 일부만 가능하고 증명 서류를 들고 고용센터에 가야 해요.",
      "정부24 안내는 상담을 거쳐 훈련이 필요하다고 인정돼야 한다고 적어요."
    ]
  },
  {
    "id": "youth-future-savings",
    "source": "national",
    "sourceName": "금융위원회",
    "category": "asset",
    "support": "savings",
    "title": "청년미래적금",
    "officialTitle": "청년미래적금 (2차 가입)",
    "oneLine": "3년 저축하면 정부가 돈을 더 얹어 줘요",
    "amount": {
      "type": "money",
      "text": "납입액의 6~12% 추가",
      "note": "월 납입 최대 50만 원"
    },
    "ageText": "만 19~34세 (2차 모집 기준 1991년 11월 17일~2007년 11월 27일생)",
    "eligibility": {
      "birthYearMin": 1991,
      "birthYearMax": 2007,
      "incomeMaxPercent": 200,
      "other": [
        "개인 소득은 총급여 7,500만 원 이하(종합소득 6,300만 원 이하)여야 해요. 또는 연 매출 3억 원 이하 소상공인이어야 해요.",
        "연 매출 3억 원을 넘는 소상공인도 종합소득 6,300만 원 이하면 일반 소득자로 가입할 수 있어요.",
        "가구 소득은 기준 중위소득 200% 이하여야 해요. 맞벌이 2인 가구는 250% 이하예요. 소득은 2025년 기준으로 봐요.",
        "총급여 6,000만 원 초과~7,500만 원 이하(종합소득 4,800만 원 초과)는 정부 기여금 없이 세금 혜택만 받아요.",
        "12% 우대형은 중소기업 재직자·신규 취업자로 총급여 3,600만 원 이하(종합소득 2,600만 원 이하)이거나, 연 매출 1억 원 이하 소상공인이어야 해요. 가구 소득은 중위소득 150% 이하(맞벌이 2인 가구 200% 이하)여야 해요.",
        "우대형은 가입 후에도 만기 한 달 전까지 중소기업에 29개월 이상 다녀야 하고, 이직은 2번까지예요. 못 채우면 일반형으로 바뀔 수 있어요.",
        "병역 기간(최대 6년)은 나이 계산에서 빼 줘요.",
        "청년도약계좌를 5년 만기까지 유지한 사람은 가입할 수 없고, 두 상품을 동시에 가질 수 없어요.",
        "2025년 소득을 확인할 수 있어야 해요.",
        "최근 3년 중 한 번이라도 금융소득 종합과세 대상이었다면 가입할 수 없어요."
      ]
    },
    "period": {
      "start": "2026-10-07",
      "end": "2026-10-16"
    },
    "status": "closed",
    "closedReason": "period",
    "nextExpected": "3차 모집, 날짜 미정 (2027년 예산 확정 후)",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "소상공인확인서 (소상공인만, 사업장마다 발급)",
        "issuer": "중소기업현황정보시스템"
      }
    ],
    "keywords": [
      "적금",
      "목돈",
      "재테크",
      "청년 적금",
      "미래적금",
      "도약계좌 갈아타기",
      "비과세"
    ],
    "originalUrl": "https://fsc.go.kr/no010101/87726?curPage=&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "youth-leap-account",
    "source": "national",
    "sourceName": "금융위원회",
    "category": "asset",
    "support": "savings",
    "title": "청년도약계좌 (신규 가입 종료)",
    "officialTitle": "청년도약계좌",
    "oneLine": "새로 가입할 수 없고 청년미래적금이 뒤를 이어요",
    "amount": {
      "type": "none",
      "text": "신규 가입 종료"
    },
    "eligibility": {
      "other": [
        "기존 가입자는 청년미래적금 2차 모집부터 갈아탈 수 있었지만, 2차 신청은 10월 16일에 끝났어요.",
        "갈아타려면 미래적금 심사를 통과해 계좌를 연 뒤 도약계좌를 특별중도해지해야 해요. 순서를 어기면 안 돼요.",
        "3차 모집에서도 갈아타기가 되는지는 확인 필요."
      ]
    },
    "period": {},
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [],
    "keywords": [
      "도약계좌",
      "청년 적금",
      "갈아타기",
      "미래적금",
      "5년 적금"
    ],
    "originalUrl": "https://www.fsc.go.kr/no010101/87106",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "youth-culture-pass",
    "source": "national",
    "sourceName": "문화체육관광부",
    "category": "living",
    "support": "voucher",
    "title": "청년 문화예술패스",
    "officialTitle": "2026년 청년문화예술패스 (추가 발급)",
    "oneLine": "공연·전시·영화·책 값을 포인트로 지원해요",
    "amount": {
      "type": "money",
      "text": "15만~20만 원",
      "maxWon": 200000,
      "note": "포인트. 서울·경기·인천은 15만 원"
    },
    "ageText": "2006~2007년생 (19~20세)",
    "eligibility": {
      "birthYearMin": 2006,
      "birthYearMax": 2007,
      "other": [
        "대한민국 국적이에요",
        "2025년 패스를 쓴 적이 없어요",
        "내 지역 예산이 아직 남아 있어요"
      ]
    },
    "period": {
      "start": "2026-08-10",
      "end": "2026-11-30"
    },
    "status": "open",
    "apply": {
      "method": "online",
      "loginRequired": true
    },
    "documents": [],
    "keywords": [
      "영화",
      "공연",
      "전시",
      "뮤지컬",
      "연극",
      "책",
      "문화비",
      "20살",
      "대학 새내기"
    ],
    "originalUrl": "https://www.mcst.go.kr/kor/s_notice/press/pressView.jsp?pSeq=22640",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "대한민국 국적이어야 해요. 공고에 소득과 재산 조건은 없어요.",
      "평생 1회 지원이라 2025년 패스를 쓴 사람은 받을 수 없어요. 실제로 쓴 금액이 없었다면 예외예요.",
      "올해 상반기에 받고 7월 31일까지 한 번도 안 써서 회수된 사람은 다시 신청할 수 없어요.",
      "금액은 신청할 때 주민등록 주소로 정해져요. 서울·경기·인천 15만 원, 그 밖의 지역 20만 원이에요.",
      "신청 순서대로 받고, 지역 예산이 떨어지면 그 지역은 먼저 마감돼요. 지금 경기도 잔여분은 확인 필요.",
      "지자체 예산이 확보된 지역에서만 발급돼요.",
      "책은 지원금의 20% 안에서만 살 수 있고(수도권 3만 원, 비수도권 4만 원) 예스24와 서점온에서만 돼요. 참고서·실용서·청소년 도서·아동 그림책은 빠져요.",
      "영화는 수도권 2회, 그 밖의 지역 4회까지 볼 수 있어요.",
      "2026년 12월 31일(관람일 기준)까지 써야 해요."
    ]
  },
  {
    "id": "youth-job-leap-incentive",
    "source": "national",
    "sourceName": "고용노동부",
    "category": "job",
    "support": "cash",
    "title": "청년일자리도약장려금 (비수도권 근속 인센티브)",
    "officialTitle": "2026년 청년일자리도약장려금",
    "oneLine": "지방 기업에서 오래 일하면 근속금을 줘요",
    "amount": {
      "type": "money",
      "text": "최대 480만~720만 원",
      "maxWon": 7200000,
      "note": "2년간, 비수도권 근무만"
    },
    "ageText": "채용일 기준 만 15~34세 (군필자는 복무 기간만큼 늘어나 최대 39세)",
    "eligibility": {
      "birthYearMin": 1987,
      "birthYearMax": 2011,
      "statuses": [
        "employed"
      ],
      "other": [
        "채용일 기준 만 34세 이하예요 (군필자는 최대 39세)",
        "비수도권 기업에 정규직으로 일해요",
        "회사가 이 사업에 참여 신청을 했어요",
        "2026년 안에 채용됐어요"
      ]
    },
    "period": {
      "start": "2026-01-01",
      "end": "2026-12-31"
    },
    "status": "open",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "지급 신청서 (청년용)"
      },
      {
        "name": "재직증명서 또는 급여 입금내역"
      },
      {
        "name": "본인 명의 통장 사본 (처음 1회)"
      },
      {
        "name": "사업자등록사실여부 증명 (회사에 제출)",
        "issuer": "국세청 홈택스"
      }
    ],
    "keywords": [
      "취업 지원금",
      "근속",
      "지방 취업",
      "중소기업",
      "첫 직장",
      "장려금",
      "귀향 취업"
    ],
    "originalUrl": "https://m.work24.go.kr/cm/c/f/1100/selecSystInfo.do?currentPageNo=1&recordCountPerPage=10&systId=SI00000318&systClId=SC00000117",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "청년에게 돈이 가는 건 비수도권 기업에 취업한 경우뿐이에요. 서울·인천·경기 기업에 취업하면 회사만 지원받아서 용인 근무 청년은 받을 수 없어요.",
      "예외로 인천 강화·옹진, 경기 가평·연천 기업은 비수도권으로 취급하고 우대지원지역이라 최대 600만 원이에요.",
      "금액은 지역마다 달라요. 일반 지역 480만 원, 우대지원지역 600만 원, 특별지원지역 720만 원을 6·12·18·24개월 차에 나눠 받아요.",
      "정규직, 주 28시간 이상, 평균 월급 450만 원 이하, 6개월 이상 근속해야 해요. 2026년 안에 채용돼야 해요.",
      "회사가 5인 이상 우선지원대상기업(업종 특례는 5인 미만도, 비수도권은 산업단지 입주 중견기업도 가능)이고 사업에 참여 신청을 해야 해요.",
      "채용일에 다른 곳에 취업 중이면 안 돼요. 사업자등록이 있어도 취업 중으로 봐요(휴업·폐업 등 예외 있음).",
      "채용일 기준 고등학교나 대학에 재학·휴학 중이면 제외돼요. 사이버·야간대학, 대학원, 일학습병행, 마지막 학기를 마친 고교 졸업예정자는 예외예요.",
      "사업주의 배우자·직계 가족은 제외돼요.",
      "회사가 1회차 지원금을 받은 뒤에 청년이 직접 신청하고, 회차마다 기한(근속일 다음 달부터 2개월 안)을 넘기면 받을 수 없어요.",
      "인원이나 예산이 차면 조기에 마감될 수 있어요. 지금 소진 여부는 확인 필요."
    ]
  },
  {
    "id": "youth-tomorrow-savings",
    "source": "national",
    "sourceName": "보건복지부",
    "category": "asset",
    "support": "savings",
    "title": "청년내일저축계좌",
    "officialTitle": "2026년 자산형성지원사업 (청년내일저축계좌)",
    "oneLine": "일하는 저소득 청년 저축에 월 30만 원을 더해요",
    "amount": {
      "type": "money",
      "text": "월 30만 원 추가",
      "note": "3년 뒤 약 1,440만 원"
    },
    "ageText": "신청 당시 만 15~39세",
    "eligibility": {
      "birthYearMin": 1986,
      "birthYearMax": 2011,
      "incomeMaxPercent": 50,
      "statuses": [
        "employed"
      ],
      "other": [
        "근로·사업 소득이 월 10만 원 이상이어야 해요.",
        "가구 소득인정액(소득과 재산을 합쳐 계산)이 기준 중위소득 50% 이하여야 해요.",
        "올해부터 기초생활수급자와 차상위계층(기준 중위소득 50% 이하) 청년에게 집중한다고 해요.",
        "1,440만 원은 월 10만 원씩 넣는 경우로, 본인 저축 360만 원이 포함돼요. 여기에 이자가 더해져요.",
        "3년 동안 일을 계속하고 저축을 이어 가며, 교육 10시간 이수와 자금 활용 계획서 제출이 필요해요.",
        "별도 재산 기준과 제외 대상은 공고에 없어 확인 필요."
      ]
    },
    "period": {
      "start": "2026-05-04",
      "end": "2026-05-20"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "both"
    },
    "documents": [],
    "keywords": [
      "저축",
      "목돈",
      "적금",
      "알바",
      "저소득",
      "차상위",
      "1440만원",
      "통장"
    ],
    "originalUrl": "https://m.bokjiro.go.kr/ssis-tem/cms/mob/customer/notice/1309680_1155.html",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "kosaf-national-type1",
    "source": "national",
    "sourceName": "한국장학재단",
    "category": "scholarship",
    "support": "cash",
    "title": "국가장학금 1유형",
    "officialTitle": "국가장학금Ⅰ유형(학생직접지원형)",
    "oneLine": "집안 형편에 맞춰 등록금을 나라가 지원해요",
    "amount": {
      "type": "money",
      "text": "연 최대 600만 원",
      "maxWon": 6000000,
      "note": "2026년 기준. 기초·차상위는 등록금 전액"
    },
    "eligibility": {
      "incomeMaxPercent": 300,
      "statuses": [
        "student"
      ],
      "other": [
        "대한민국 국적으로 국내 대학에 다녀요",
        "학자금 지원구간 1~9구간이에요",
        "직전 학기 12학점 이상, 80점 이상이에요 (신입생은 성적을 안 봐요)"
      ]
    },
    "period": {},
    "status": "upcoming",
    "nextExpected": "2026년 11월 말~12월 말 1차 예정 (날짜 공고 전)",
    "apply": {
      "method": "online",
      "loginRequired": true
    },
    "documents": [],
    "keywords": [
      "국가장학금",
      "등록금",
      "1유형",
      "소득구간",
      "학자금 지원구간",
      "장학금 신청"
    ],
    "originalUrl": "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_01_01&naviParam=JH,02,02,05",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "대한민국 국적으로 국내 대학에 다니는 학생만 신청할 수 있어요. 외국 대학은 안 돼요.",
      "2026학년도 기준 학자금 지원구간 1~9구간까지 받을 수 있어요. 구간은 소득에 재산을 더해 계산하므로 소득만으로 판정할 수 없어요.",
      "2027년 1학기부터 구간이 1~10구간에서 가~마 5개 구간으로 바뀔 예정이에요. 바뀐 구간의 기준은 확인이 필요해요.",
      "직전 학기 12학점 이상 이수, 성적 100점 만점에 80점 이상이 필요해요. 기초·차상위는 70점 이상이에요.",
      "1~3구간은 70점 이상 80점 미만이어도 경고 후 2번까지 받을 수 있어요. 적용 여부는 학생이 고를 수 없어요.",
      "신입생·편입생·재입학생은 첫 학기 성적을 보지 않아요. 졸업 학기와 초과 학기는 이수학점을 보지 않아요.",
      "장애 학생은 성적을 보지 않고, 자립준비청년은 성적만 보지 않아요(이수학점은 봄).",
      "가구원 동의와 서류 제출까지 끝내야 심사돼요.",
      "재학생은 1차 신청이 원칙이에요. 2차 신청은 재학 중 2번까지만 구제돼요.",
      "받을 수 있는 횟수에 제한이 있어요. 4년제 기준 8회예요. 학교를 옮겨도 합쳐서 세요.",
      "2026학년도 기준으로 일부 대학은 평가 결과에 따라 신입생·편입생이 제외돼요. 2027학년도 대상 대학은 확인이 필요해요."
    ]
  },
  {
    "id": "kosaf-national-type2",
    "source": "national",
    "sourceName": "한국장학재단",
    "category": "scholarship",
    "support": "cash",
    "title": "국가장학금 2유형",
    "officialTitle": "국가장학금Ⅱ유형(대학연계지원형)",
    "oneLine": "대학이 자체 기준으로 등록금을 더 지원해요",
    "amount": {
      "type": "money",
      "text": "학교마다 달라요",
      "note": "금액은 학교 기준 확인 필요"
    },
    "eligibility": {
      "incomeMaxPercent": 300,
      "statuses": [
        "student"
      ],
      "other": [
        "내 학교가 이 장학금에 참여해요",
        "학자금 지원구간 1~9구간이에요",
        "학교 성적 기준에 맞아요"
      ]
    },
    "period": {},
    "status": "upcoming",
    "nextExpected": "2026년 11월 말~12월 말 1차 예정 (날짜 공고 전)",
    "apply": {
      "method": "online",
      "loginRequired": true
    },
    "documents": [],
    "keywords": [
      "국가장학금",
      "등록금",
      "2유형",
      "대학연계",
      "장학금 신청"
    ],
    "originalUrl": "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_01_02&naviParam=JH,02,03,05",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "대한민국 국적으로 이 장학금에 참여하는 대학의 학생만 받을 수 있어요. 참여 대학은 바뀔 수 있어 확인이 필요해요.",
      "2026학년도 기준 학자금 지원구간 1~9구간이 대상이에요. 10구간은 갑자기 형편이 어려워진 경우 등 대학이 필요하다고 판단할 때만 받을 수 있어요.",
      "2027년 1학기부터 구간이 가~마 5개 구간으로 바뀔 예정이에요. 바뀐 구간의 기준은 확인이 필요해요.",
      "성적 기준은 정해진 값이 없고 학교 기준을 따라요. 형편이 어려운 학생은 기준이 완화될 수 있어요.",
      "가구원 동의와 서류 제출까지 끝내야 심사돼요.",
      "재학생은 1차 신청이 원칙이에요. 2차 신청은 재학 중 2번까지만 구제돼요.",
      "자립준비청년, 쉼터 입·퇴소 청소년, 청소년 한부모, 장애 학생, 세 자녀 이상 가구 학생, 가족돌봄청년 등을 먼저 지원하도록 권고돼 있어요.",
      "2026학년도 기준으로 일부 대학은 평가 결과에 따라 신입생·편입생이 제외돼요. 2027학년도 대상 대학은 확인이 필요해요."
    ]
  },
  {
    "id": "yongin-city-scholarship-2026",
    "source": "foundation",
    "sourceName": "용인시장학재단",
    "category": "scholarship",
    "support": "cash",
    "title": "용인시장학재단 장학금",
    "officialTitle": "2026년도 (재)용인시장학재단 장학생 선발",
    "oneLine": "용인에 2년 이상 산 학생에게 장학금을 줘요",
    "amount": {
      "type": "money",
      "text": "분야마다 달라요",
      "note": "분야별 금액은 확인 필요"
    },
    "eligibility": {
      "regions": [
        "경기도 용인시"
      ],
      "residencyMonths": 24,
      "statuses": [
        "student"
      ],
      "other": [
        "공고일 기준 용인시에 주민등록을 두고 2년 이상 계속 산 시민과 그 직계비속이 대상이에요.",
        "같은 해에 다른 장학금을 받으면 안 돼요. 단, 대학생은 등록금 범위 안에서 함께 받을 수 있어요.",
        "분야는 12개예요. 철쭉, 진학, 우수, 기능, 효행, 자립, 향토, 무지개, 곰두리, 보훈, 주거비, 드림이에요. 철쭉과 우수는 성적 우수 학생 대상이에요.",
        "분야별 자격, 소득·성적 기준, 금액은 공고문 첨부 파일에 있어 확인이 필요해요.",
        "교육비 분야는 다자녀 가정 중학생 대상이라 대학생은 해당하지 않아요."
      ]
    },
    "period": {
      "start": "2026-03-18",
      "end": "2026-04-10"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "visit"
    },
    "documents": [],
    "keywords": [
      "용인",
      "용인시장학재단",
      "용인 장학금",
      "철쭉장학금",
      "자립장학금",
      "향토장학금",
      "주거비장학금"
    ],
    "originalUrl": "https://www.inu.ac.kr/inu/1519/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGaW51JTJGMjQ5JTJGNDIwNDUwJTJGYXJ0Y2xWaWV3LmRvJTNG",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "gyeonggi-domin-scholarship-2026",
    "source": "foundation",
    "sourceName": "경기도민회장학회",
    "category": "scholarship",
    "support": "cash",
    "title": "경기도민회 장학금",
    "officialTitle": "경기도민회장학회 2026년도 장학생 선발",
    "oneLine": "경기도 3년 이상 거주 가정의 자녀를 지원해요",
    "amount": {
      "type": "money",
      "text": "최대 400만 원",
      "maxWon": 4000000,
      "note": "대학생 기준. 전문대생 최대 300만 원"
    },
    "eligibility": {
      "regions": [
        "경기도"
      ],
      "residencyMonths": 36,
      "statuses": [
        "student"
      ],
      "other": [
        "본인이 아니라 부 또는 모가 접수 마감일 기준 주민등록상 3년 이상 경기도에 연속해서 살아야 해요. 2026년 기준 2023년 6월 13일 이전부터 살아야 했어요.",
        "기존 장학생이나 혼인한 학생, 부모가 모두 사망한 학생은 본인 기준으로 거주 기간을 봐요.",
        "대학 재학생은 직전 학기 12학점 이상 이수, 평점 3.0 이상이어야 해요.",
        "대학 신입생은 수능 백분위 평균 또는 고3 내신 전과목 평균이 80점 이상이어야 해요.",
        "소득은 학자금 지원구간 통지서(2026년 1학기 기준)로 봐요. 구간 기준 숫자는 공고문 확인이 필요해요.",
        "장학금은 본인이 내는 등록금 범위 안에서 줘요.",
        "2026년 선발 계획은 대학생 313명, 전문대생 85명, 사이버·방통대생 30명, 체육특기생 26명, 예능특기생 24명이었어요.",
        "예·체능 특기생은 고등학생만 신청할 수 있어요."
      ]
    },
    "period": {
      "start": "2026-06-01",
      "end": "2026-06-12"
    },
    "status": "closed",
    "closedReason": "period",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "학자금 지원구간 통지서 (2026년 1학기 기준)"
      }
    ],
    "keywords": [
      "경기도 장학금",
      "경기도민회",
      "경기도민 자녀",
      "대학생 장학금"
    ],
    "originalUrl": "https://www.kyeonggi.com/article/20260521580531",
    "linkCheckedAt": "2026-11-04"
  },
  {
    "id": "hufs-dream-global-2026-2",
    "source": "school",
    "sourceName": "한국외국어대학교",
    "schoolId": "hufs",
    "category": "scholarship",
    "support": "cash",
    "title": "글로벌캠퍼스 드림 장학금",
    "officialTitle": "2026-2학기 글로벌캠퍼스 HUFS Dream 장학금",
    "oneLine": "형편이 갑자기 어려워진 학생의 등록금을 도와요",
    "amount": {
      "type": "money",
      "text": "최대 100만 원",
      "maxWon": 1000000,
      "note": "등록금 범위 안에서"
    },
    "eligibility": {
      "schoolIds": [
        "hufs"
      ],
      "statuses": [
        "student"
      ],
      "other": [
        "글로벌캠퍼스 2026-2학기 재학생이에요",
        "직전 학기 12학점 이상, 평점 2.0 이상이에요 (신입생은 성적을 안 봐요)",
        "자립준비청년, 쉼터 입·퇴소 청소년, 청소년 한부모, 경제사정 곤란자 중 하나예요"
      ]
    },
    "period": {
      "start": "2026-11-03",
      "end": "2026-11-27"
    },
    "status": "open",
    "apply": {
      "method": "online",
      "loginRequired": true
    },
    "documents": [
      {
        "name": "장학금 신청서"
      },
      {
        "name": "가족관계증명서 (실직, 폐업, 가족 질병·사고)"
      },
      {
        "name": "퇴직증명서 또는 고용보험 피보험자격신고사실통지서 (실직)"
      },
      {
        "name": "폐업사실증명서 (폐업)"
      },
      {
        "name": "진단서, 입원 확인서, 병원 진료 영수증 중 하나 (가족 질병·사고)"
      },
      {
        "name": "보호 종료 확인서 (자립준비청년)"
      },
      {
        "name": "쉼터 입소 확인증 또는 퇴소사실증명서 (쉼터 입·퇴소 청소년)"
      },
      {
        "name": "한부모 가족 증명서 (청소년 한부모 본인)"
      },
      {
        "name": "2026-2학기 학자금 지원구간 확인서 (국가장학금 지원횟수 초과로 거절된 학생)"
      },
      {
        "name": "형편이 어려운 정도를 보여 주는 서류 (그 밖의 경제사정 곤란자)"
      }
    ],
    "keywords": [
      "한외대 장학금",
      "외대 장학금",
      "글로벌캠퍼스",
      "등록금",
      "실직",
      "폐업",
      "가계곤란",
      "자립준비청년"
    ],
    "originalUrl": "https://www.hufs.ac.kr/bbs/hufs/2182/270613/artclView.do",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "한국외대 글로벌캠퍼스 2026-2학기 재학생이 대상이에요. 초과 학기 학생도 신청할 수 있어요.",
      "직전 정규 학기에 12학점 이상 이수하고 평점 2.0 이상이어야 해요.",
      "8학기 이상 등록한 학생은 이수학점을 보지 않아요. 직전 성적이 없는 신입생·편입생·재입학생은 성적을 보지 않아요.",
      "자립준비청년, 쉼터 입·퇴소 청소년, 청소년 한부모, 경제사정 곤란자 중 하나여야 해요.",
      "경제사정 곤란자는 부모의 실직·폐업, 가족의 장기 투병이나 갑작스러운 사고, 그 밖의 경제적 어려움을 말해요.",
      "공지에 소득 기준은 따로 없어요.",
      "대출과 장학금을 합쳐 등록금을 넘으면 대출을 먼저 갚아야 해요."
    ]
  },
  {
    "id": "hufs-startup-scholarship-2026",
    "source": "school",
    "sourceName": "한국외국어대학교",
    "schoolId": "hufs",
    "category": "scholarship",
    "support": "cash",
    "title": "한국외대 창업 장학금",
    "officialTitle": "2026학년도 HUFS 앙트레프레너십 장학금(창업장학금)",
    "oneLine": "창업 활동을 한 학부생에게 100만 원을 줘요",
    "amount": {
      "type": "money",
      "text": "100만 원",
      "maxWon": 1000000,
      "note": "생활비 성격"
    },
    "eligibility": {
      "schoolIds": [
        "hufs"
      ],
      "statuses": [
        "student"
      ],
      "other": [
        "학부 재학생으로 1학기 이상 다녔어요 (휴학생 제외)",
        "2026년에 창업 실적이 있어요",
        "재학 중 이 장학금을 받은 적이 없어요"
      ]
    },
    "period": {
      "start": "2026-10-27",
      "end": "2026-11-27"
    },
    "status": "open",
    "apply": {
      "method": "online"
    },
    "documents": [
      {
        "name": "장학금 지원신청서 (서식 1, 본인 서명)"
      },
      {
        "name": "서술형 작성 항목 (서식 2)"
      },
      {
        "name": "가채점표와 항목별 증빙자료 (서식 3)"
      },
      {
        "name": "개인정보 수집·이용·제공 동의서 (서식 4, 서명)"
      },
      {
        "name": "본인 명의 통장 사본"
      },
      {
        "name": "사업자등록증, 실적 증빙, 성적표 등 증빙자료"
      },
      {
        "name": "학자금 지원구간 통지서 (선택, 동점일 때 형편 심사를 원하면)"
      }
    ],
    "keywords": [
      "창업",
      "창업장학금",
      "외대 장학금",
      "대학생 창업",
      "사업자등록",
      "생활비"
    ],
    "originalUrl": "https://www.hufs.ac.kr/bbs/hufs/2182/269143/artclView.do",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "한국외대 학부 재학생으로 1학기 이상 다닌 학생이 대상이에요. 휴학생은 신청할 수 없어요.",
      "학교 장학금 지급 규정 제8조에 해당하고 제9조에 해당하지 않아야 해요. 규정 내용은 확인이 필요해요.",
      "일반유흥주점업, 부동산 임대업 같은 창업 제외 업종은 안 돼요.",
      "재학 중 1번만 받을 수 있어요.",
      "최대 6명(서울캠퍼스 3명, 글로벌캠퍼스 3명)을 뽑고, 적임자가 없으면 뽑지 않을 수 있어요.",
      "2026년 1월 1일부터 12월 31일까지 생긴 창업 실적으로 평가해요. 총 400점(정량 350점, 정성 50점)이에요."
    ]
  },
  {
    "id": "hufs-kwanjeong-undergrad-2027",
    "source": "foundation",
    "sourceName": "관정재단",
    "schoolId": "hufs",
    "category": "scholarship",
    "support": "cash",
    "title": "관정재단 학부 장학금",
    "officialTitle": "2027년도 관정재단 학부 장학생 모집",
    "oneLine": "성적 우수 3학년 진학생에게 학기마다 지원해요",
    "amount": {
      "type": "money",
      "text": "학기당 최대 600만 원",
      "maxWon": 6000000,
      "note": "A형 600만 원, B형 최고 400만 원"
    },
    "ageText": "만 24세 이하(2003년 1월 1일 이후 출생), 군필자는 복무 기간 제외",
    "eligibility": {
      "schoolIds": [
        "hufs"
      ],
      "statuses": [
        "student"
      ],
      "other": [
        "만 24세 이하예요 (2003년 이후 출생, 군필자는 복무 기간 제외)",
        "2027년 1학기에 5학기로 올라가는 학부생이에요",
        "1~3학기 평균 평점이 4.0 이상이에요",
        "대학 총장 추천을 받을 수 있어요"
      ]
    },
    "period": {
      "start": "2026-11-05",
      "end": "2026-11-17"
    },
    "status": "upcoming",
    "apply": {
      "method": "online",
      "loginRequired": true
    },
    "documents": [
      {
        "name": "장학금 지원 신청서"
      },
      {
        "name": "성적증명서 1부"
      },
      {
        "name": "2026년 2학기 학자금 지원구간 통지서 1부"
      }
    ],
    "keywords": [
      "관정재단",
      "관정 장학금",
      "외대 장학금",
      "성적장학금",
      "재단 장학금",
      "3학년",
      "생활비"
    ],
    "originalUrl": "https://www.hufs.ac.kr/bbs/hufs/2182/270802/artclView.do",
    "linkCheckedAt": "2026-11-04",
    "cautions": [
      "군필자는 복무 기간을 빼고 나이를 따져요. 2003년 전에 태어났어도 될 수 있어요.",
      "2027년 1학기에 5학기(3학년 1학기)로 올라가는 학부생이 대상이에요. 휴학 예정자와 편입생은 안 돼요.",
      "학부 1~3학기 평균 평점이 4.5 만점에 4.0 이상이어야 해요. 휴학 등으로 2학년 2학기 성적이 있으면 포함해요.",
      "대한민국 국적으로 국내 고등학교를 나와야 해요. 부모 국외 근무로 해외 고교를 다녔거나 검정고시 합격자는 가능하고, 영주권자와 복수국적자는 원칙적으로 안 돼요.",
      "대학 총장 추천이 필요해요. 한국외대 추천은 5명 예정이고 자연이공계열 8, 인문사회계열 2 비율이에요.",
      "소득 수준도 심사해요.",
      "A형은 다른 장학금과 함께 받을 수 없어요. B형은 국가·학교 장학금과 함께 받을 수 있지만 금액이 조정될 수 있어요.",
      "두 유형 모두 다른 민간재단 장학금을 받으면 받을 수 없어요.",
      "자기소개서를 AI로 쓰면 탈락해요."
    ]
  }
];
