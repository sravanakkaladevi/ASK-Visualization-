import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';
import { LldState } from '../visualizers/LldView';

export const LLD_RIDE_BOOKING_CODE_SNIPPETS: CodeSnippets = {
  typescript: `enum RideStatus { REQUESTED, ASSIGNED, IN_PROGRESS, COMPLETED }

class Ride {
  private id: string;
  private pickup: string;
  private destination: string;
  private fare: number;
  private status: RideStatus = RideStatus.REQUESTED;

  constructor(id: string, pickup: string, destination: string) {
    this.id = id;
    this.pickup = pickup;
    this.destination = destination;
    this.fare = this.calculateFare();
  }

  public calculateFare(): number {
    return 15.0 + Math.random() * 10;
  }

  public startRide(): void {
    this.status = RideStatus.IN_PROGRESS;
  }
}`,
  python: `from enum import Enum

class RideStatus(Enum):
    REQUESTED = 1
    ASSIGNED = 2
    IN_PROGRESS = 3
    COMPLETED = 4

class Ride:
    def __init__(self, ride_id: str, pickup: str, destination: str):
        self.ride_id = ride_id
        self.pickup = pickup
        self.destination = destination
        self.fare = self.calculate_fare()
        self.status = RideStatus.REQUESTED

    def calculate_fare(self) -> float:
        return 24.50

    def start_ride(self) -> None:
        self.status = RideStatus.IN_PROGRESS`,
  java: `public enum RideStatus { REQUESTED, ASSIGNED, IN_PROGRESS, COMPLETED }

public class Ride {
    private String id;
    private String pickup;
    private String destination;
    private double fare;
    private RideStatus status;

    public Ride(String id, String pickup, String destination) {
        this.id = id;
        this.pickup = pickup;
        this.destination = destination;
        this.fare = calculateFare();
        this.status = RideStatus.REQUESTED;
    }

    public double calculateFare() { return 24.50; }
    public void startRide() { this.status = RideStatus.IN_PROGRESS; }
}`,
  cpp: `enum class RideStatus { REQUESTED, ASSIGNED, IN_PROGRESS, COMPLETED };

class Ride {
private:
    std::string id;
    std::string pickup;
    std::string destination;
    double fare;
    RideStatus status;

public:
    Ride(std::string id, std::string pickup, std::string destination)
        : id(id), pickup(pickup), destination(destination), status(RideStatus::REQUESTED) {
        fare = calculateFare();
    }

    double calculateFare() { return 24.50; }
    void startRide() { status = RideStatus::IN_PROGRESS; }
};`,
};

export function generateLldRideBookingSteps(): Step<LldState>[] {
  const steps: Step<LldState>[] = [];

  const rideClassBlueprint = {
    id: 'class-ride',
    className: 'Ride',
    type: 'class' as const,
    properties: [
      { name: 'pickup', type: 'String' },
      { name: 'destination', type: 'String' },
      { name: 'fare', type: 'Double' },
      { name: 'status', type: 'RideStatus' },
    ],
    methods: [
      { name: 'calculateFare', returnType: 'Double' },
      { name: 'startRide', returnType: 'Void' },
      { name: 'endRide', returnType: 'Void' },
    ],
  };

  // Step 1: Class Blueprint
  steps.push({
    state: {
      systemName: 'Ride Booking App (Uber/Lyft LLD)',
      classes: [rideClassBlueprint],
      activeClassId: 'class-ride',
      logMessage: 'LLD Phase 1: Define UML Class Blueprint with properties and methods.',
    },
    highlightedLines: [3, 4, 5, 6, 7, 8],
    description: 'LLD Design Phase: Define Class "Ride" blueprint specifying encapsulation fields (pickup, destination, fare, status) and operations.',
  });

  // Step 2: Instantiating Object
  steps.push({
    state: {
      systemName: 'Ride Booking App (Uber/Lyft LLD)',
      classes: [rideClassBlueprint],
      activeClassId: 'class-ride',
      objectInstance: {
        id: 'obj-101',
        classRefId: 'class-ride',
        objectName: 'ride_101',
        fieldValues: {
          id: '"ride_101"',
          pickup: '"Central Park"',
          destination: '"Times Square"',
          fare: '$24.50',
          status: 'RideStatus.REQUESTED',
        },
        status: 'instantiating',
      },
      logMessage: 'LLD Phase 2: User requests ride -> Constructor allocates heap object ride_101.',
    },
    highlightedLines: [10, 11, 12, 13, 14, 15],
    description: 'Runtime Object Instantiation: User clicks "Book Ride". Constructor allocates heap object "ride_101" with pickup="Central Park" & destination="Times Square".',
  });

  // Step 3: Invoking Method & Updating State
  steps.push({
    state: {
      systemName: 'Ride Booking App (Uber/Lyft LLD)',
      classes: [rideClassBlueprint],
      activeClassId: 'class-ride',
      objectInstance: {
        id: 'obj-101',
        classRefId: 'class-ride',
        objectName: 'ride_101',
        fieldValues: {
          id: '"ride_101"',
          pickup: '"Central Park"',
          destination: '"Times Square"',
          fare: '$24.50',
          status: 'RideStatus.IN_PROGRESS',
        },
        status: 'active',
      },
      logMessage: 'LLD Phase 3: Driver assigned -> Call ride_101.startRide() -> State transitions to IN_PROGRESS.',
    },
    highlightedLines: [21, 22, 23],
    description: 'Method Execution: Invoking method ride_101.startRide() updates encapsulated state status="RideStatus.IN_PROGRESS". LLD encapsulation verified!',
  });

  return steps;
}

export const lldRideBookingDefinition: AlgorithmDefinition<unknown, LldState> = {
  meta: {
    id: 'lld-ride-booking',
    name: 'LLD: Ride Booking System (Uber/Lyft)',
    category: 'system-design',
    timeComplexity: {
      best: 'O(1) Dispatch',
      average: 'O(1) Booking',
      worst: 'O(1) State Change',
    },
    spaceComplexity: 'O(1) Heap Memory',
    description: 'Low-Level Design (LLD) visualization of Class blueprint to runtime Heap Object instantiation for a Ride Booking system.',
    code: LLD_RIDE_BOOKING_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'architecture',
  },
  generateSteps: generateLldRideBookingSteps,
};
