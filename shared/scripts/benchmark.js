class Benchmark {
    static Time = 0;
    static Count = 0;
    static Interval = null;

    static startBenchmark(timestamp = 1000, durationInSeconds = 10) {
        Benchmark.Interval = setInterval(() => {
            Benchmark.printBenchmark();
        }, timestamp);

        setTimeout(() => {
            this.Interval = null;
        }, durationInSeconds)
    }

    static updateData(time) {
        Benchmark.Time += time;
        Benchmark.Count++;
    }

    static printBenchmark() {
        const avg = Benchmark.Count == 0 ? 0 : Benchmark.Time / Benchmark.Count;
        console.log("Average time for " + Benchmark.Count + " units equals: " + avg);
        Benchmark.clearData();
    }

    static clearData() {
        Benchmark.Time = 0;
        Benchmark.Count = 0;
    }
}