<template>
  <div class="example">
    <v-card hover>
      <apexchart width="500" height="300" type="heatmap" :options="chartOptions" :series="series"></apexchart>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'ReportHeatmap',
  data: function () {
    return {
      chartOptions: {
        title: {
          text: 'HeatMap Chart (Single color):'
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#008FFB'],
        xaxis: {
          type: 'category'
        }
      },
      series: [
        {
          name: 'Metric1',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric2',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric3',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric4',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric5',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric6',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric7',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric8',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric9',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        }
      ]
    }
  },
  methods: {
    generateData (count, yrange) {
      var i = 0
      var series = []
      while (i < count) {
        var x = (i + 1).toString()
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

        series.push({
          x: x,
          y: y
        })
        i++
      }
      return series
    }
  }
}

</script>
