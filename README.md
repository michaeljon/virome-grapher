# Getting started with the virome grapher

```bash
mkdir server
mkdir server/gaps
mkdir server/depths
```

In `ViromeTracker/RunData` there are a pile of depth.gz files, you'll need those. In fact, you'll want to copy these:

- \*.depth.gz (for running the gap computation)
- \*\_\_all.tsv (for running the depth computations)
- \*.pdf (this is a nonce for determining which samples are 'interesting')
- \*.name.txt (handy way to map from sequence id to a human-readable name)

First, you'll need `scripts/rungaps` to re-run the gap computation into JSON format. You then run, from there, `scripts/stage-depths` to get the depth files into right shape and location.

```bash
# from ViromeTracker
scripts/rungaps

# from ViromeTracker/RunData
scripts/stage-depths <target>
```

After running `rungaps` copy the data.

```bash
# from ViromeTracker/RunData
cp **/*+gap-report.json ~/src/informatics/virome-grapher/server/gaps
```

Then, build out the batch list.

```bash
cd server
gawk -f ../scripts/mk-batchlist.awk ~/tmp/demo2/source-data/all-samples-with-metadata.tsv > batchlist.json
```

Next, build out the sample list.

```bash
cd server
/bin/ls -1 depths/*.json |
    grep -vP "all-samples|batchlist" |
    awk -vALL_SAMPLES=~/tmp/demo2/source-data/all-samples-with-metadata.tsv -f ../scripts/mk-list.awk > all-samples.json
```
