
const cityInput = document.querySelector('#registerCity')
const districtInput = document.querySelector('#registerDistrict')
const wardInput = document.querySelector('#registerWard')

districtInput.disabled = true
wardInput.disabled = true
districtInput.innerHTML = '<option hidden disabled selected value> ---- </option>'
wardInput.innerHTML = '<option hidden disabled selected value> ---- </option>'


const cityAPI = (cityCode) => {
    return `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
}

const districtAPI = (districtCode) => {
    return `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
}

const fetchCities = async() => {
    const citiesResponse = await fetch('https://provinces.open-api.vn/api/')
    const citiesData = await citiesResponse.json()
    const cities = citiesData.map(city => {
        return `<option value="${city.code}">${city.name}</option>`
    }).join('\n')
    return cities
}

const fetchDistricts = async (cityCode) => {
    districtInput.innerHTML = '<option hidden disabled selected value> -- Chọn quận huyện -- </option>'
    const districtResponse = await fetch(cityAPI(cityCode))
    districtInput.disabled = false
    wardInput.disabled = true
    const districtsData = await districtResponse.json()
    const districts = districtsData.districts.map(district => {
        return `<option value="${district.code}">${district.name}</option>`
    }).join('\n')
    return districts
}

const fetchWards = async(districtCode) => {
    wardInput.innerHTML = '<option hidden disabled selected value> -- Chọn phường xã -- </option>'
    const wardResponse = await fetch(districtAPI(districtCode))
    wardInput.disabled = false
    const wardsData = await wardResponse.json()
    const wards = wardsData.wards.map(ward => {
        return `<option value="${ward.code}">${ward.name}</option>`
    }).join('\n')
    return wards
}

const fetchAPI = async () => {
    cityInput.innerHTML = '<option hidden disabled selected value> -- Chọn thành phố -- </option>'
    const cities = await fetchCities()
    cityInput.innerHTML += cities 

    cityInput.addEventListener('change', async (event) => {
       const districts = await fetchDistricts(event.target.value)
       districtInput.innerHTML += districts
    })

    districtInput.addEventListener('change', async (event) => {
        const wards = await fetchWards(event.target.value)
        wardInput.innerHTML += wards
     })
}
fetchAPI()    