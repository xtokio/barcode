window.addEventListener('load', function () {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect')
        selectedDeviceId = videoInputDevices[0].deviceId
        
        if (videoInputDevices.length > 1)
        {
            selectedDeviceId = videoInputDevices[1].deviceId
            videoInputDevices.forEach((element) => {
                console.log(`Label: ${element.label} DeviceID: ${element.deviceId}`);
            });
        }

        document.getElementById('startButton').addEventListener('click', () => {
            var startButton = document.getElementById('startButton');
            if(startButton.getAttribute('data-status') == "start")
            {
                startButton.setAttribute('data-status','reset');

                codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', async (result, err) => {
                if (result) 
                {
                    console.log(result)
                    document.getElementById('result').textContent = result.text
                    let upc = result.text;
                    let params = {upc};
                    let response_data = await post("/barcode",params).catch(message => console.log(message));
                    let data = await response_data.json();
                    console.log(data);
                    document.getElementById('product').textContent = data.title;
                    document.getElementById('product_image').setAttribute("src",data.image);
                    
                }
                if (err && !(err instanceof ZXing.NotFoundException)) {
                    console.error(err)
                    document.getElementById('result').textContent = err
                }
                })
                console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
            }
            else
            {
                startButton.setAttribute('data-status','start');

                codeReader.reset()
                document.getElementById('result').textContent = "";
                document.getElementById('product').textContent = "";
                document.getElementById('product_image').setAttribute("src","http://dummyimage.com/250x155/");
                console.log('Reset.')
            }
        })

        })
        .catch((err) => {
        console.error(err)
        })
    
    function post(url,params={})
    {
      return fetch(url,{
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
      });
    }
});