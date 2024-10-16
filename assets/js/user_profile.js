<script>
    $(document).ready(function () {
        $.ajax({
            url: '/getProfile',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const addressOptions = $('#addressOptions');

                data.forEach(function (address) {
                    const radioButton = `
                <div class="form-check mb-3 p-3 border rounded shadow-sm">
              <input class="form-check-input ml-1" type="radio" name="address" id="address-${address.id}" value="${address.id}">
              <label class="form-check-label fw-bold ml-4" for="address-${address.id}">
              ${address.fullName}
                <div class="text-muted ml-6">
                  ${address.no}, ${address.street}, ${address.landMark}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country} <a class="text-primary" data-toggle="modal" data-target="#exampleModal"
                          data-whatever="@mdo"><i class="fas fa-edit ml-1"></i></a> 
                          <a class="text-danger"><i class="fas fa-trash ml-1"></i></a>
                </div>
              </label>
            </div>

          `;
                    addressOptions.append(radioButton);
                });
            },
            error: function (xhr, status, error) {
                console.error('Failed to fetch addresses:', error);
                $('#addressOptions').html('<div>Failed to load addresses</div>');
            }
        });
        });
</script>