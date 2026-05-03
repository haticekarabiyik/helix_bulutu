export interface Lesson {
  id: string;
  title: string;
  price: string; // stroops cinsinden
  instructor: string;
  total_purchased: number;
}

export interface Purchase {
  student: string;
  lesson_id: string;
  instructor: string;
  amount_paid: string;
  timestamp: number;
}

export interface ExamResult {
  student: string;
  score: number;
  timestamp: number;
}

export class LessonContractClient {
  private contractId: string;
  private rpcUrl: string;

  constructor(contractId: string, rpcUrl: string = 'https://soroban-testnet.stellar.org') {
    this.contractId = contractId;
    this.rpcUrl = rpcUrl;
  }

  /**
   * Sözleşmeyi başlatır
   */
  async initialize(adminAddress: string, tokenAddress: string): Promise<string> {
    // Stellar RPC çağrısı yapılacak
    // Gerçek uygulamada server tarafından handle edilmelidir
    console.log('Initializing contract with admin:', adminAddress, 'and token:', tokenAddress);
    return 'tx_hash';
  }

  /**
   * Yeni ders ekler
   */
  async addLesson(
    adminAddress: string,
    lessonId: string,
    title: string,
    price: string,
    instructorAddress: string
  ): Promise<string> {
    console.log('Adding lesson:', {
      lessonId,
      title,
      price,
      instructor: instructorAddress,
    });
    return 'tx_hash';
  }

  /**
   * Dersi satın al
   */
  async purchaseLesson(
    studentAddress: string,
    lessonId: string,
    instructorAddress: string
  ): Promise<boolean> {
    console.log('Purchasing lesson:', {
      student: studentAddress,
      lesson: lessonId,
      instructor: instructorAddress,
    });
    return true;
  }

  /**
   * Öğrenci dersi satın aldı mı kontrol et
   */
  async hasPurchased(
    studentAddress: string,
    lessonId: string,
    instructorAddress: string
  ): Promise<boolean> {
    console.log('Checking purchase status:', {
      student: studentAddress,
      lesson: lessonId,
      instructor: instructorAddress,
    });
    return true;
  }

  /**
   * Final sınav sonucunu kaydet
   */
  async submitExamResult(studentAddress: string, score: number): Promise<string> {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    console.log('Submitting exam result:', { student: studentAddress, score });
    return 'tx_hash';
  }

  /**
   * Leaderboard'u getir
   */
  async getLeaderboard(): Promise<ExamResult[]> {
    // Mock data (gerçek uygulamada RPC çağrısı yapılacak)
    return [
      { student: 'G...1', score: 98, timestamp: Date.now() },
      { student: 'G...2', score: 92, timestamp: Date.now() },
      { student: 'G...3', score: 85, timestamp: Date.now() },
    ];
  }

  /**
   * Ödülü talep et
   */
  async claimReward(studentAddress: string): Promise<string> {
    console.log('Claiming reward for student:', studentAddress);
    // stroops cinsinden
    return '1000000'; // 0.1 XLM
  }

  /**
   * Tüm dersleri getir
   */
  async getAllLessons(): Promise<Lesson[]> {
    // Mock data
    return [
      {
        id: 'coulomb-1',
        title: 'Coulomb Yasası',
        price: '5000000', // 0.5 XLM
        instructor: 'G...instructor1',
        total_purchased: 15,
      },
      {
        id: 'kinematik-1',
        title: 'Bir Boyutlu İvmeli Hareket',
        price: '3900000', // 0.39 XLM
        instructor: 'G...instructor2',
        total_purchased: 22,
      },
    ];
  }

  /**
   * Toplam geliri getir (admin only)
   */
  async getTotalRevenue(adminAddress: string): Promise<string> {
    console.log('Getting total revenue (admin:', adminAddress, ')');
    return '500000000'; // 50 XLM
  }

  /**
   * Öğrencinin satın aldığı dersleri getir
   */
  async getStudentPurchases(studentAddress: string): Promise<Purchase[]> {
    console.log('Getting purchases for student:', studentAddress);
    return [
      {
        student: studentAddress,
        lesson_id: 'coulomb-1',
        instructor: 'G...instructor1',
        amount_paid: '5000000',
        timestamp: Date.now(),
      },
    ];
  }
}

/**
 * Stroops'u XLM'ye dönüştür
 */
export function stroopsToXlm(stroops: string): string {
  const stroopsNum = BigInt(stroops);
  const xlm = stroopsNum / BigInt(10000000);
  return xlm.toString();
}

/**
 * XLM'yi stroops'a dönüştür
 */
export function xlmToStroops(xlm: string): string {
  const xlmNum = BigInt(xlm);
  const stroops = xlmNum * BigInt(10000000);
  return stroops.toString();
}
